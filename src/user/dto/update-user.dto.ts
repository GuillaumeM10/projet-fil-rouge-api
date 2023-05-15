import { PartialType } from '@nestjs/mapped-types';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { PostEntity } from 'src/post/entity/post.entity';
import { ReplyEntity } from 'src/reply/entities/reply.entity';
import { UserDetailEntity } from 'src/user-detail/entities/user-detail.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  userDetail?: UserDetailEntity;
  posts?: PostEntity[];
  comments?: CommentEntity[];
  replies?: ReplyEntity[];
}
