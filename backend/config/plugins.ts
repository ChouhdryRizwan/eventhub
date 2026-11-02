import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      // Plain 30-day JWT (SRS: Strapi auth + JWT); NextAuth keeps it in its session.
      jwtManagement: 'legacy-support',
      register: { allowedFields: ['full_name', 'phone'] },
    },
  },
  // Gmail SMTP by default (use a Google "App password", not the account password).
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 465),
        secure: env.bool('SMTP_SECURE', env.int('SMTP_PORT', 465) === 465),
        auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
        // Fail fast so a mail problem never leaves a request hanging.
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      },
      settings: {
        defaultFrom: `EventHub <${env('SMTP_USER', 'no-reply@eventhub.local')}>`,
        defaultReplyTo: env('SMTP_USER', 'no-reply@eventhub.local'),
      },
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
