import { PostEntity } from "src/post/entity/post.entity";
import { UserEntity } from "src/user/entities/user.entity";

export class CreateCommentDto {
  content: string;
  user: UserEntity;
  post: PostEntity;
}
