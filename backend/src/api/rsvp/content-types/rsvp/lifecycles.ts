import { refreshEventStats, eventIdFromLifecycle } from '../../../../utils/event-stats';

const uid = 'api::rsvp.rsvp';

export default {
  async afterCreate(event: any) {
    await refreshEventStats(strapi, await eventIdFromLifecycle(strapi, uid, event));
  },
  async afterUpdate(event: any) {
    await refreshEventStats(strapi, await eventIdFromLifecycle(strapi, uid, event));
  },
  async beforeDelete(event: any) {
    // Remember the parent event; the row is gone by afterDelete.
    event.state = { eventId: await eventIdFromLifecycle(strapi, uid, event) };
  },
  async afterDelete(event: any) {
    await refreshEventStats(strapi, event.state?.eventId);
  },
};
