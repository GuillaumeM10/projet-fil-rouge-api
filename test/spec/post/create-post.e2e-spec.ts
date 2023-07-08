import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { createUser } from 'test/utils/fixtures/user/createUser';
import { clearDB } from 'test/utils/clearDB';

describe('POST post e2e', () => { // <--- this is the test suite we are writing
  let app: INestApplication;
  let jwt: string;

  beforeEach(async () => { // <--- this is the hook we are adding before each test
    app = await initTestModule(app);
    const response = await createUser(app);
    jwt = response.accessToken;
  });
  
  afterAll(async () => { // <--- this is the hook we are adding at the end
    await clearDB(app);
    await app.close();
  });

  it('should create a post', async () => { // <--- this is the test we are writing
    const createPostData = {
      content: 'post 1',
      published: true,
    };

    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${jwt}`)
      .send(createPostData);

    // make the test pass or fail
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('content');
    expect(response.body.content).toBe(createPostData.content);
  });
});