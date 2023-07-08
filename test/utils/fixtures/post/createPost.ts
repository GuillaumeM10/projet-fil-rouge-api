import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entity/post.entity';
import { Repository } from 'typeorm';

export const createPost = async (app: INestApplication, content: string, published: boolean) => {
  const postRepository = app.get<Repository<PostEntity>>(
    getRepositoryToken(PostEntity),
  );

  const post = postRepository.create({ content, published });
  await postRepository.save(post);

  return post;
};