import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Public URL of the API (e.g. https://eventhub-api.onrender.com). Needed for correct admin and media links.
  url: env('PUBLIC_URL', undefined),
  // Render terminates TLS in front of Strapi; trust its X-Forwarded-* headers so secure cookies work.
  proxy: { koa: env.bool('IS_PROXIED', false) },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
