// uid fields are only auto-filled by the admin UI; generate the slug for API-created events.
export default {
  async beforeCreate(event: any) {
    const data = event.params.data;
    if (data.slug || !data.title) return;
    data.slug = await strapi
      .service('plugin::content-manager.uid')
      .generateUIDField({ contentTypeUID: 'api::event.event', field: 'slug', data });
  },
};
