import { Timestamp } from "src/Generic/timestamp.entity";
import { PostEntity } from "src/post/entity/post.entity";
import { ReplyEntity } from "src/reply/entities/reply.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('comment')  
export class CommentEntity extends Timestamp{
  @PrimaryGeneratedColumn()
  id: number
  
  @Column({
    nullable: false
  })
  content: string

  @ManyToOne(() => UserEntity, user => user.comments, {
    onDelete: 'CASCADE'
  })
  user: UserEntity

  @ManyToOne(() => PostEntity, post => post.comments, {
    onDelete: 'CASCADE'
  })
  post: PostEntity

  @OneToMany(() => ReplyEntity, reply => reply.comment, {
    cascade: true,
    nullable: true
  })
  replies: ReplyEntity[]
}
