import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { UploadFileModule } from 'src/upload-file/upload-file.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    UploadFileModule,
    UserModule
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
