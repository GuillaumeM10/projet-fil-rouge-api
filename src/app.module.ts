import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserDetailModule } from './user-detail/user-detail.module';
import { CommentModule } from './comment/comment.module';
import { SkillModule } from './skill/skill.module';
import { LinkModule } from './link/link.module';
import { FileModule } from './file/file.module';
import { ExperienceModule } from './experience/experience.module';
import { LinkCategoryModule } from './link-category/link-category.module';
import { CityModule } from './city/city.module';
import { ReplyModule } from './reply/reply.module';
import { MailModule } from './mail/mail.module';
import { TokenResetPasswordModule } from './token-reset-password/token-reset-password.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    UserDetailModule,
    PostModule,
    MailModule,
    TokenResetPasswordModule,
    // CommentModule,
    // SkillModule,
    // LinkModule,
    // FileModule,
    // ExperienceModule,
    // LinkCategoryModule,
    // CityModule,
    // ReplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
