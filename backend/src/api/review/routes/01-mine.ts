// Custom route; the "01-" prefix makes it load before the core router so "mine" is not read as an :id.
export default {
  routes: [
    {
      method: 'GET',
      path: '/reviews/mine',
      handler: 'review.mine',
      config: {},
    },
  ],
};
