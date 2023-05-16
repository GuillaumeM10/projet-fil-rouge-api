import { PostEntity } from "src/post/entity/post.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";

export class CreateSkillDto {
  id?: number;
  name?: string;
  level?: number;
  description?: string;
  // posts?: PostEntity[];
  // users?: UserDetailEntity[];
}
