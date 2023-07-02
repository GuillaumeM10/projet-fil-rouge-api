import { Module, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostEntity } from './entity/post.entity';
import { PostService } from './post.service';
import { UploadFileModule } from 'src/upload-file/upload-file.module';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    UploadFileModule,
    CityModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
