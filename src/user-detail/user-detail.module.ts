import { Module } from '@nestjs/common';
import { UserDetailService } from './user-detail.service';
import { UserDetailController } from './user-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailEntity } from './entities/user-detail.entity';
import { UploadFileModule } from 'src/upload-file/upload-file.module';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDetailEntity]),
    UploadFileModule,
    CityModule
  ],
  controllers: [UserDetailController],
  providers: [UserDetailService],
  exports: [UserDetailService]
})
export class UserDetailModule {}
