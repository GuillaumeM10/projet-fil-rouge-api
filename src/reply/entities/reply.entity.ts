import { CommentEntity } from "src/comment/entities/comment.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reply')
export class ReplyEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @ManyToOne(() => CommentEntity, comment => comment.replies)
  comment: CommentEntity

  @ManyToOne(() => UserEntity, user => user.replies)
  author: UserEntity
}
