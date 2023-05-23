import { PartialType } from '@nestjs/mapped-types';
import { UploadFileEntity } from 'src/upload-file/entities/upload-file.entity';
import { UserDetailEntity } from 'src/user-detail/entities/user-detail.entity';
import { CreateFileDto } from './create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  id?: number;
  userDetail?: UserDetailEntity;
  files?: UploadFileEntity[];
}
