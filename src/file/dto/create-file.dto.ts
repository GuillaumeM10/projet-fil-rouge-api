import { UploadFileEntity } from "src/upload-file/entities/upload-file.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";

export class CreateFileDto {
  id?: number;
  userDetail?: UserDetailEntity;
  files?: UploadFileEntity[];
}
