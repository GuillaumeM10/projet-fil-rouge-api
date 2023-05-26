import { UserEntity } from "src/user/entities/user.entity";

export class PostUpdateDto {
  title?: string;
  description?: string;
  city?: string;
  categories?: Array<any>;
  published?: boolean;
  userId?: number;
  author?: UserEntity;
  uploadFiles?: any[];
}