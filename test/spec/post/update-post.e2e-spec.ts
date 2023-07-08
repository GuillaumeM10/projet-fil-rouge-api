import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { createUser } from 'test/utils/fixtures/user/createUser';
import { clearDB } from 'test/utils/clearDB';
import { createPost } from 'test/utils/fixtures/post/createPost';
import { PostEntity } from 'src/post/entity/post.entity';

describe('PATCH post e2e', () => { // <--- this is the test suite we are writing
  let app: INestApplication;
  let jwt: string;
  let post1: PostEntity;

  beforeEach(async () => { // <--- this is the hook we are adding before each test
    app = await initTestModule(app);
    const response = await createUser(app);
    jwt = response.accessToken;
    post1 = await createPost(app, 'post1', true);
  });

  afterAll(async () => { // <--- this is the hook we are adding at the end
    await clearDB(app);
    await app.close();
  });

  it('should update a post', async () => { // <--- this is the test we are writing
    const updatePostData = {
      content: 'post1 updated',
      published: true,
    };

    await request(app.getHttpServer())
      .put('/posts/' + post1.id)
      .set('Authorization', `Bearer ${jwt}`)
      .send(updatePostData);

    const response = await request(app.getHttpServer())
      .get('/posts/' + post1.id)
      .set('Authorization', `Bearer ${jwt}`);

    // make the test pass or fail
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('content');
    expect(response.body.content).toBe(updatePostData.content);
  });
});