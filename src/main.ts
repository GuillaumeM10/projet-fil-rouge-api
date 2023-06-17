import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: ['/']
  });

  const config = new DocumentBuilder()
  .setTitle('StudyJobs')
  .setDescription('API Documentation')
  .setVersion('1.0')
  .addTag('StudyJobs')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(); 
  await app.listen(PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
