import { createOwnedController } from '../../../utils/owned-controller';
import { sendRsvpConfirmation } from '../../../utils/mail';

const factory = createOwnedController('api::rsvp.rsvp', { uniquePerEvent: true });

// Same as the owned controller, plus a confirmation email once an RSVP is really created.
export default (args: any) => {
  const controller: any = factory(args);
  const create = controller.create;
  controller.create = async function (ctx: any) {
    // No RSVPs for events that are already over (end time, or start time when there is no end).
    const targetId = ctx.request.body?.data?.event;
    if (targetId) {
      const target = await args.strapi
        .documents('api::event.event')
        .findOne({ documentId: String(targetId), fields: ['start_datetime', 'end_datetime'] });
      const when = target && new Date(target.end_datetime ?? target.start_datetime).getTime();
      if (when && when < Date.now()) return ctx.badRequest('This event has already ended.');
    }
    const result = await create.call(controller, ctx);
    // A conflict/unauthorized reply has no `data`, so only a real new RSVP gets an email.
    const created = result?.data;
    if (created?.documentId && ctx.state.user && created.status !== 'cancelled') {
      const eventId = ctx.request.body?.data?.event;
      // Fire and forget: the RSVP response must not wait for (or fail because of) SMTP.
      void (async () => {
        const event = eventId
          ? await args.strapi.documents('api::event.event').findOne({ documentId: String(eventId) })
          : null;
        await sendRsvpConfirmation(args.strapi, ctx.state.user, event);
      })().catch((e) => args.strapi.log.warn(`RSVP email skipped: ${e.message}`));
    }
    return result;
  };
  return controller;
};
