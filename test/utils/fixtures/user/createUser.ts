import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createUser = async (app: INestApplication) => {
  const email = 'test@example.com';
  const password = 'password';

  await request(app.getHttpServer())
    .post('/auth/signup')
    .send({ 
      email, 
      password,
      "userDetail": {
        "country": "France"
      }
    });

  const signin = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email, password });
  
  return signin.body;
};