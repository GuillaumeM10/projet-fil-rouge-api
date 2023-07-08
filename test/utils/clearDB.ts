import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entity/post.entity';
import { UserDetailEntity } from 'src/user-detail/entities/user-detail.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

export const clearDB = async (app: INestApplication) => {
  const postsRepository = app.get<Repository<PostEntity>>(
    getRepositoryToken(PostEntity),
  );

  const userDetailRepository = app.get<Repository<UserDetailEntity>>(
    getRepositoryToken(UserDetailEntity),
  );

  const userRepository = app.get<Repository<UserEntity>>(
    getRepositoryToken(UserEntity),
  );

  await postsRepository.delete({}).then(async() => { // <--- this is the hook we are adding at the end to clear the DB
    await userDetailRepository.delete({}).then(async() => {
      await userRepository.delete({});
    });
  });
};