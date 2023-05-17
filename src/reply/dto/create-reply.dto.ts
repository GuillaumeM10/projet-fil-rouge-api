import { CommentEntity } from "src/comment/entities/comment.entity";
import { UserEntity } from "src/user/entities/user.entity";

export class CreateReplyDto {
  content?: string;
  author?: UserEntity;
  comment?: CommentEntity;
}
