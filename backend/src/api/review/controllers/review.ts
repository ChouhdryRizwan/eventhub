import { createOwnedController } from '../../../utils/owned-controller';

const base = createOwnedController('api::review.review', {
  publicRead: true,
  uniquePerEvent: true,
  // Public review lists cannot populate the user, so keep the author's display name on the review.
  extraData: (user) => ({ author_name: user.full_name || user.username }),
});

export default (context: any) => {
  // Add to the controller object itself: spreading it would drop the core prototype methods.
  const controller: any = base(context);

  // GET /api/reviews/mine: the logged-in user's own reviews (the public list cannot filter by user).
  controller.mine = async (ctx: any) => {
    if (!ctx.state.user) return ctx.unauthorized();
    const results = await strapi.documents('api::review.review').findMany({
      filters: { user: { id: ctx.state.user.id } },
      populate: { event: { fields: ['title', 'slug'] } },
      sort: ['createdAt:desc'],
      limit: 100,
    });
    return { data: results, meta: { pagination: { total: results.length } } };
  };

  return controller;
};
