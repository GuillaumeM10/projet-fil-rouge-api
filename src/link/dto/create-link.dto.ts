import { LinkCategoryEntity } from "src/link-category/entities/link-category.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";

export class CreateLinkDto {
  name?: string;
  url?: string;
  description?: string;
  user?: UserDetailEntity;
  linkCategory?: LinkCategoryEntity;
}
