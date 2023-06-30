import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserDetailModule } from './user-detail/user-detail.module';
import { SkillModule } from './skill/skill.module';
import { LinkModule } from './link/link.module';
import { ExperienceModule } from './experience/experience.module';
import { LinkCategoryModule } from './link-category/link-category.module';
import { MailModule } from './mail/mail.module';
import { TokenResetPasswordModule } from './token-reset-password/token-reset-password.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { CityModule } from './city/city.module';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';
console.log('isProductionDB', isProduction);


const typeOrmConfig: TypeOrmModuleOptions = isProduction
  ? {
      type: 'postgres',
      url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}?options=project%3D${process.env.ENDPOINT_ID}`,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      // extra: {
      //   min: 2,
      //   max: 5
      // }
    }
  : {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      // extra: {
      //   min: 2,
      //   max: 5
      // }
    };

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserModule,
    UserDetailModule,
    PostModule,
    MailModule,
    TokenResetPasswordModule,
    UploadFileModule,
    CommentModule, // new
    ReplyModule,
    SkillModule,
    CityModule,
    LinkModule,
    LinkCategoryModule,
    ExperienceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}