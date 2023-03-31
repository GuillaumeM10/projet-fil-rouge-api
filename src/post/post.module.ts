import { Module, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostEntity } from './entity/post.entity';
import { PostService } from './post.service';
import { UploadFileModule } from 'src/upload-file/upload-file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    UploadFileModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
