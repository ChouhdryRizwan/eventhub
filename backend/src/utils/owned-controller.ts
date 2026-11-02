import { factories } from '@strapi/strapi';

type Options = {
  publicRead?: boolean;
  /** Reject a second record for the same user + event (RSVP, bookmark, review). */
  uniquePerEvent?: boolean;
  /** Server-side fields merged into every created record; client-sent values are ignored. */
  extraData?: (user: any) => Record<string, unknown>;
};

const isApiToken = (ctx: any) => ctx.state?.auth?.strategy?.name === 'content-api-token';

// Fields a client may never set or change directly on an owned record.
const SERVER_FIELDS = ['user', 'author_name'];

export const createOwnedController = (
  uid: any,
  { publicRead = false, uniquePerEvent = false, extraData }: Options = {}
) =>
  factories.createCoreController(uid, ({ strapi }) => ({
    async find(ctx) {
      if (publicRead || isApiToken(ctx)) return super.find(ctx);
      if (!ctx.state.user) return ctx.unauthorized();
      // The controller's query validation rejects filtering on the user relation, so drop any
      // client-supplied user filter and apply the ownership filter on the service call instead.
      const { user, ...clientFilters } = (ctx.query.filters as Record<string, unknown>) || {};
      ctx.query = { ...ctx.query, filters: clientFilters };
      const self = this as any;
      const query = await self.sanitizeQuery(ctx);
      const { results, pagination } = await strapi.service(uid).find({
        ...query,
        filters: { $and: [query.filters || {}, { user: { id: ctx.state.user.id } }] },
      });
      return self.transformResponse(await self.sanitizeOutput(results, ctx), { pagination });
    },

    async create(ctx) {
      if (!ctx.state.user) return ctx.unauthorized();
      const self = this as any;
      // The controller's input validation rejects the user relation, so validate the client's
      // data first and attach the owner ourselves via the document service.
      const data: Record<string, any> = { ...(ctx.request.body?.data || {}) };
      for (const field of SERVER_FIELDS) delete data[field];
      await self.validateInput(data, ctx);

      if (uniquePerEvent && data.event) {
        const existing = await strapi.documents(uid).count({
          filters: { user: { id: ctx.state.user.id }, event: { documentId: data.event } },
        });
        if (existing > 0) return ctx.conflict('You have already done this for this event.');
      }

      const entry = await strapi.documents(uid).create({
        data: { ...data, ...(extraData?.(ctx.state.user) ?? {}), user: ctx.state.user.id },
      });
      return self.transformResponse(await self.sanitizeOutput(entry, ctx));
    },

    async update(ctx) {
      if (!(await ownsRecord(strapi, uid, ctx))) return ctx.forbidden();
      // Owners may edit their content, but not re-assign it to another user or event.
      const rest: Record<string, unknown> = { ...(ctx.request.body?.data || {}) };
      for (const field of [...SERVER_FIELDS, 'event']) delete rest[field];
      ctx.request.body = { data: rest };
      return super.update(ctx);
    },

    async delete(ctx) {
      if (!(await ownsRecord(strapi, uid, ctx))) return ctx.forbidden();
      return super.delete(ctx);
    },
  }));

async function ownsRecord(strapi: any, uid: any, ctx: any) {
  if (isApiToken(ctx)) return true;
  if (!ctx.state.user) return false;
  const record = await strapi.documents(uid).findOne({
    documentId: ctx.params.id,
    populate: ['user'],
  });
  return record?.user?.id === ctx.state.user.id;
}
