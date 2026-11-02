import type { Core } from '@strapi/strapi';
import { categories, events } from './seed-data';
import { emailLayout, frontendUrl, isMailConfigured } from './utils/mail';

const PUBLIC_PERMISSIONS = [
  'api::event.event.find',
  'api::event.event.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
  'api::review.review.find',
  'api::review.review.findOne',
  'plugin::users-permissions.auth.emailConfirmation',
  'plugin::users-permissions.auth.sendEmailConfirmation',
];

const AUTHENTICATED_PERMISSIONS = [
  ...PUBLIC_PERMISSIONS,
  'api::event.event.create',
  'api::event.event.update',
  'api::event.event.mine',
  'api::rsvp.rsvp.find',
  'api::rsvp.rsvp.findOne',
  'api::rsvp.rsvp.create',
  'api::rsvp.rsvp.update',
  'api::review.review.create',
  'api::review.review.update',
  'api::review.review.delete',
  'api::review.review.mine',
  'api::bookmark.bookmark.find',
  'api::bookmark.bookmark.findOne',
  'api::bookmark.bookmark.create',
  'api::bookmark.bookmark.delete',
  'plugin::users-permissions.user.me',
  'plugin::users-permissions.user.update',
  'plugin::users-permissions.auth.changePassword',
  'plugin::upload.content-api.upload',
];

async function grantPermissions(strapi: Core.Strapi, roleType: string, actions: string[]) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: roleType } });
  if (!role) return;
  for (const action of actions) {
    const exists = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: role.id } });
    if (!exists) {
      await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
    }
  }
}

// Frontend admin panel role (users-permissions role with type "admin"): same API rights as
// an authenticated user; moderation itself runs server-side with STRAPI_API_TOKEN.
async function ensureAdminRole(strapi: Core.Strapi) {
  const query = strapi.db.query('plugin::users-permissions.role');
  const existing = await query.findOne({ where: { type: 'admin' } });
  if (!existing) {
    await query.create({ data: { name: 'Administrator', type: 'admin', description: 'EventHub site administrator' } });
  }
  await grantPermissions(strapi, 'admin', AUTHENTICATED_PERMISSIONS);
}

// Optional dev convenience: ADMIN_SEED_EMAIL + ADMIN_SEED_PASSWORD create an Administrator account.
async function ensureAdminUser(strapi: Core.Strapi) {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) return;
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'admin' } });
  const users = strapi.db.query('plugin::users-permissions.user');
  const existing = await users.findOne({ where: { email } });
  if (existing) {
    if (role && existing.role !== role.id) await users.update({ where: { id: existing.id }, data: { role: role.id } });
    return;
  }
  await strapi.plugin('users-permissions').service('user').add({
    username: email,
    email,
    full_name: 'EventHub Admin',
    password,
    confirmed: true,
    blocked: false,
    provider: 'local',
    role: role?.id,
  });
  strapi.log.info(`Created admin account ${email}`);
}

// Strapi only substitutes plain variables (URL, CODE, USER.<field>) in these templates, never expressions.
// Sign-up email confirmation is on whenever SMTP is configured (otherwise nobody could ever confirm).
async function configureEmailConfirmation(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const advanced: any = (await store.get({ key: 'advanced' })) ?? {};
  const enabled = isMailConfigured();
  const redirect = `${frontendUrl()}/login?confirmed=1`;
  if (advanced.email_confirmation !== enabled || advanced.email_confirmation_redirection !== redirect) {
    await store.set({
      key: 'advanced',
      value: { ...advanced, email_confirmation: enabled, email_confirmation_redirection: redirect },
    });
  }
  if (!enabled) return;

  const templates: any = (await store.get({ key: 'email' })) ?? {};
  templates.email_confirmation = {
    ...templates.email_confirmation,
    options: {
      ...templates.email_confirmation?.options,
      from: { name: 'EventHub', email: process.env.SMTP_USER },
      response_email: process.env.SMTP_USER,
      object: 'Confirm your EventHub account',
      message: emailLayout(
        'Confirm your email',
        `<p style="margin:0;line-height:1.5">Hi <%= USER.full_name %>, welcome to EventHub! Confirm your email address to activate your account, then you can RSVP, save events and leave reviews.</p>
<p style="margin:24px 0"><a href="<%= URL %>?confirmation=<%= CODE %>" style="background:#5b21b6;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700;display:inline-block">Confirm my email</a></p>
<p style="margin:0;font-size:13px;color:#6b7280">Button not working? Paste this link into your browser:<br><span style="word-break:break-all"><%= URL %>?confirmation=<%= CODE %></span></p>`,
      ),
    },
  };
  await store.set({ key: 'email', value: templates });
}

async function seed(strapi: Core.Strapi) {
  if ((await strapi.documents('api::category.category').count({})) > 0) return;
  strapi.log.info('Seeding categories and events...');
  const bySlug: Record<string, string> = {};
  for (const c of categories) {
    const doc = await strapi.documents('api::category.category').create({ data: c });
    bySlug[c.slug] = doc.documentId;
  }
  for (const e of events) {
    await strapi.documents('api::event.event').create({
      data: { ...e, category: bySlug[e.category] } as any,
    });
  }
  strapi.log.info(`Seeded ${categories.length} categories and ${events.length} events.`);
}

export default {
  // Extend the built-in users-permissions User with profile fields.
  register({ strapi }: { strapi: Core.Strapi }) {
    const user: any = strapi.contentType('plugin::users-permissions.user');
    user.attributes.full_name = { type: 'string' };
    user.attributes.phone = { type: 'string' };
    user.attributes.bio = { type: 'text' };
    user.attributes.profile_pic = { type: 'media', multiple: false, allowedTypes: ['images'] };
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPermissions(strapi, 'public', PUBLIC_PERMISSIONS);
    await grantPermissions(strapi, 'authenticated', AUTHENTICATED_PERMISSIONS);
    await ensureAdminRole(strapi);
    await ensureAdminUser(strapi);
    await configureEmailConfirmation(strapi);
    if (process.env.SEED_DATA === 'true') await seed(strapi);
  },
};
