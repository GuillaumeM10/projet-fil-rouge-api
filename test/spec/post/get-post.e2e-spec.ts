import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { clearDB } from 'test/utils/clearDB';
import { PostEntity } from 'src/post/entity/post.entity';
import { createPost } from 'test/utils/fixtures/post/createPost';

describe('GET posts e2e', () => { // <--- this is the test suite we are writing
  let app: INestApplication;
  let post1: PostEntity;
  let post2: PostEntity;

  beforeEach(async () => { // <--- this is the hook we are adding before each test
    app = await initTestModule(app);
    post1 = await createPost(app, 'post1', true);
    post2 = await createPost(app, 'post2', true);
  });

  afterAll(async () => { // <--- this is the hook we are adding at the end
    await clearDB(app);
    await app.close();
  });

  it('should get posts', async () => { // <--- this is the test we are writing
    const response = await request(app.getHttpServer()).get('/posts');

    // make the test pass or fail
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    
    expect(response.body[0].content).toBe(post2.content);
    expect(response.body[0].published).toBe(post2.published);

    expect(response.body[1].content).toBe(post1.content);
    expect(response.body[1].published).toBe(post1.published);
  });
});