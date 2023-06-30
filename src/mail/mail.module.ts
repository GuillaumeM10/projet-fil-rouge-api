import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        if (isProduction) {
          return {
            transport: createTransport({
              host: 'smtp-relay.brevo.com',
              port: 587,
              secure: false,
              auth: {
                user: configService.get('MAIL_USER'),
                pass: configService.get('MAIL_PASSWORD'),
              },
            }),
            defaults: {
              from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
            },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          };
        } else {
          // Use Nodemailer in development environment
          return {
            transport: {
              host: process.env.MAIL_HOST,
              port: +process.env.MAIL_PORT,
              secure: false,
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
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}