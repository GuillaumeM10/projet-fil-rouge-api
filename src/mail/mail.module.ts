import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

// prod
// transport: {
//   host: process.env.MAIL_HOST,
//   port: +process.env.MAIL_PORT,
//   secure: true,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//   },
// },

// dev
// transport: {
//   host: process.env.MAIL_HOST,
//   port: +process.env.MAIL_PORT,
//   secure: false,
// },

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      // transport: process.env.MAIL_TRANSPORT,
      // or
      transport: {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
