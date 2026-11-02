import type { Core } from '@strapi/strapi';

/** Emails are only on when SMTP credentials exist; otherwise features fall back gracefully. */
export const isMailConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

export const frontendUrl = () =>
  (process.env.FRONTEND_URL || (process.env.CORS_ORIGINS || '').split(',')[0] || 'http://localhost:3000')
    .trim()
    .replace(/\/$/, '');

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Branded wrapper shared by every EventHub email (inline styles: email clients ignore stylesheets). */
export function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="background:#0d0d0d;padding:20px 28px;font-size:22px;font-weight:700;color:#ffffff">Event<span style="color:#a78bfa">Hub</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 14px;font-size:22px;color:#111827">${escapeHtml(title)}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 28px;background:#f9fafb;font-size:12px;color:#6b7280">You received this email because of activity on your EventHub account. If this wasn't you, you can ignore it.</td></tr>
</table></td></tr></table></body></html>`;
}

export const emailButton = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="background:#5b21b6;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700;display:inline-block">${escapeHtml(label)}</a></p>`;

const formatKarachi = (iso?: string | null) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Karachi',
      }).format(new Date(iso)) + ' (PKT)'
    : '';

/** Sends the "you're going" email. Never throws: a mail problem must not undo the RSVP. */
export async function sendRsvpConfirmation(strapi: Core.Strapi, user: any, event: any) {
  if (!isMailConfigured() || !user?.email || !event) return;
  const price = event.is_free || !Number(event.ticket_price) ? 'Free' : `Rs. ${Number(event.ticket_price).toLocaleString('en-US')}`;
  const link = `${frontendUrl()}/events/${event.slug}`;
  const name = user.full_name || user.username || 'there';
  const rows: [string, string][] = [
    ['When', formatKarachi(event.start_datetime)],
    ['Where', event.venue_address],
    ['Price', price],
    ...(event.organizer_name ? ([['Organizer', event.organizer_name]] as [string, string][]) : []),
  ];
  const table = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;vertical-align:top">${k}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(v)}</td></tr>`,
    )
    .join('');
  const html = emailLayout(
    "You're going!",
    `<p style="margin:0 0 16px;line-height:1.5">Hi ${escapeHtml(name)}, your RSVP is confirmed for <strong>${escapeHtml(event.title)}</strong>.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px">${table}</table>
${emailButton(link, 'View event details')}
<p style="margin:0;font-size:13px;color:#6b7280">Plans changed? You can cancel from <a href="${escapeHtml(frontendUrl())}/dashboard" style="color:#5b21b6">your dashboard</a>.</p>`,
  );
  const text = `Hi ${name}, your RSVP is confirmed for ${event.title}.\n\n${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}\n\nDetails: ${link}\nCancel any time from your dashboard: ${frontendUrl()}/dashboard`;
  try {
    await strapi.plugin('email').service('email').send({
      to: user.email,
      subject: `RSVP confirmed: ${event.title}`,
      html,
      text,
    });
  } catch (error) {
    strapi.log.warn(`RSVP confirmation email to ${user.email} failed: ${(error as Error).message}`);
  }
}
