import type { Core } from '@strapi/strapi';

// users-permissions lets any authenticated user PUT /api/users/:id for ANY id and change
// privileged fields (role, blocked, ...). Restrict end-user JWTs to their own record and strip
// those fields. Content API tokens (server-side admin tasks) are not user JWTs, so they pass
// through; Strapi's own auth still rejects anything that is neither.
const PRIVILEGED_FIELDS = ['role', 'blocked', 'confirmed', 'provider', 'resetPasswordToken', 'confirmationToken'];

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) =>
  async (ctx: any, next: () => Promise<unknown>) => {
    const match = ctx.method === 'PUT' && /^\/api\/users\/(\d+)\/?$/.exec(ctx.path);
    if (!match) return next();

    // Runs before route auth, so ctx.state.auth is not populated yet: identify the caller here.
    const header: string = ctx.request.header.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    let userId: number | undefined;
    try {
      const payload: any = await strapi.plugin('users-permissions').service('jwt').verify(token);
      userId = Number(payload?.id);
    } catch {
      userId = undefined; // not a user JWT (API token or invalid) -> handled by Strapi's own auth
    }

    if (userId) {
      if (userId !== Number(match[1])) return ctx.forbidden('You can only update your own profile.');
      if (ctx.request.body && typeof ctx.request.body === 'object') {
        for (const field of PRIVILEGED_FIELDS) delete ctx.request.body[field];
      }
    }
    return next();
  };
