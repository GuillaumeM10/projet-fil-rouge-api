import { PartialType } from '@nestjs/mapped-types';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateReplyDto } from './create-reply.dto';

export class UpdateReplyDto extends PartialType(CreateReplyDto) {
  content?: string;
  author?: UserEntity;
  comment?: CommentEntity;
}
