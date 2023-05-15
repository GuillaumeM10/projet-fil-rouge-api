import { CommentEntity } from "src/comment/entities/comment.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reply')
export class ReplyEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => CommentEntity, comment => comment.replies)
  comment: CommentEntity

  @ManyToOne(() => UserEntity, user => user.replies)
  author: UserEntity
}
