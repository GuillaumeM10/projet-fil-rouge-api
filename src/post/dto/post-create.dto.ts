import { UserEntity } from "src/user/entities/user.entity";

export class PostCreateDto {
  id?: number;
  title?: string;
  description?: string;
  categories?: Array<any>;
  published?: boolean;
  userId?: number;
  author?: UserEntity;
  uploadFiles?: any[];
  cities?: any;
}