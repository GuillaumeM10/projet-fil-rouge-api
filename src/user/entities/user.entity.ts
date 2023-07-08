import { CommentEntity } from "src/comment/entities/comment.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { PostEntity } from "src/post/entity/post.entity";
import { ReplyEntity } from "src/reply/entities/reply.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity extends Timestamp{
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false,
    unique: true
  })
  email: string

  @Column({
    nullable: false
  })
  password: string

  @Column({
    nullable: true
  })
  firstName: string

  @Column({
    nullable: true
  })
  lastName: string

  @Column({
    nullable: true,
    unique: false,
    default: "user"
  })
  role: string

  @OneToOne(() => UserDetailEntity, userDetail => userDetail.user, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE"
  })
  @JoinColumn()
  userDetail: UserDetailEntity

  @OneToMany(() => PostEntity, post => post.author,{
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE"
  })
  posts: PostEntity[]

  @OneToMany(() => CommentEntity, comment => comment.user, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE"
  })
  comments: CommentEntity[]

  @OneToMany(() => ReplyEntity, reply => reply.author, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE"
  })
  replies: ReplyEntity[]
  
}
