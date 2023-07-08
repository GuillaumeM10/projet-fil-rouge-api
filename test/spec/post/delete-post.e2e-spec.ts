import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { createUser } from 'test/utils/fixtures/user/createUser';
import { clearDB } from 'test/utils/clearDB';
import { PostEntity } from 'src/post/entity/post.entity';
import { createPost } from 'test/utils/fixtures/post/createPost';

describe('DELETE post e2e', () => { // <--- this is the test suite we are writing
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

  it('should delete a post', async () => { // <--- this is the test we are writing
    await request(app.getHttpServer())
      .delete('/posts/' + post1.id)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/posts/' + post1.id)
      .set('Authorization', `Bearer ${jwt}`);

    // make the test pass or fail
    expect(response.status).toBe(404);
  });
});