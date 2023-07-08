import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CityModule } from 'src/city/city.module';
import { CommentModule } from 'src/comment/comment.module';
import { ExperienceModule } from 'src/experience/experience.module';
import { LinkCategoryModule } from 'src/link-category/link-category.module';
import { LinkModule } from 'src/link/link.module';
import { MailModule } from 'src/mail/mail.module';
import { PostModule } from 'src/post/post.module';
import { ReplyModule } from 'src/reply/reply.module';
import { SkillModule } from 'src/skill/skill.module';
import { TokenResetPasswordModule } from 'src/token-reset-password/token-reset-password.module';
import { UploadFileModule } from 'src/upload-file/upload-file.module';
import { UserDetailModule } from 'src/user-detail/user-detail.module';
import { testDbConfig } from './test-db.config';
import { UserModule } from 'src/user/user.module';

export const initTestModule = async (app: INestApplication) => { // <--- this is the initiation of the test module
  const moduleFixture = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testDbConfig),
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
  }).compile();

  app = moduleFixture.createNestApplication<INestApplication>();
  await app.init();
  return app;
};