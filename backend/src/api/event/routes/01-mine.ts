// Custom route; the "01-" prefix loads it before the core router so "mine" is not read as an :id.
export default {
  routes: [
    {
      method: 'GET',
      path: '/events/mine',
      handler: 'event.mine',
      config: {},
    },
  ],
};
