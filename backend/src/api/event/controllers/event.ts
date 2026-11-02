import { factories } from '@strapi/strapi';

// Server-side API tokens (Next.js admin panel) see every status; everyone else sees published only.
const isApiToken = (ctx: any) => ctx.state?.auth?.strategy?.name === 'content-api-token';

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  // GET /api/events/mine: events the logged-in user submitted, in any moderation status.
  async mine(ctx) {
    if (!ctx.state.user) return ctx.unauthorized();
    const results = await strapi.documents('api::event.event').findMany({
      filters: { submitted_by: { id: ctx.state.user.id } },
      populate: { category: true, images: true },
      sort: ['createdAt:desc'],
      limit: 100,
    });
    return { data: results, meta: { pagination: { total: results.length } } };
  },

  async find(ctx) {
    if (!isApiToken(ctx)) {
      ctx.query = {
        ...ctx.query,
        filters: { ...((ctx.query.filters as object) || {}), status: 'published' },
      };
    }
    return super.find(ctx);
  },

  async findOne(ctx) {
    const res: any = await super.findOne(ctx);
    if (!isApiToken(ctx) && res?.data?.status !== 'published') return ctx.notFound();
    return res;
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user && !isApiToken(ctx)) return ctx.unauthorized();
    const { status, is_featured, submitted_by, ...data } = ctx.request.body?.data || {};
    await (this as any).validateInput(data, ctx);
    // Submitted events always start pending, never featured, owned by the submitter.
    // API tokens (admin panel) may set moderation fields directly.
    const extra = isApiToken(ctx)
      ? { status: status ?? 'pending', is_featured: is_featured ?? false }
      : { status: 'pending', is_featured: false, submitted_by: user.id };
    const entry = await strapi.documents('api::event.event').create({ data: { ...data, ...extra } as any });
    return (this as any).transformResponse(await (this as any).sanitizeOutput(entry, ctx));
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!isApiToken(ctx)) {
      // Authenticated users may only edit their own events and never change moderation fields.
      const existing: any = await strapi.documents('api::event.event').findOne({
        documentId: ctx.params.id,
        populate: ['submitted_by'],
      });
      if (!existing || existing.submitted_by?.id !== user?.id) return ctx.forbidden();
      const { status, is_featured, submitted_by, ...rest } = ctx.request.body?.data || {};
      ctx.request.body = { data: rest };
    }
    return super.update(ctx);
  },
}));
