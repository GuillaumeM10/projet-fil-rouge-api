import { CommentEntity } from "src/comment/entities/comment.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { PostEntity } from "src/post/entity/post.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
    nullable: false
  })
  firstName: string

  @Column({
    nullable: false
  })
  lastName: string

  @Column({
    nullable: true,
    unique: false,
    default: "user"
  })
  role: string

  @OneToOne(() => UserDetailEntity, userDetail => userDetail.user, {
    cascade: ["insert"]
  })
  @JoinColumn()
  userDetail: UserDetailEntity

  @OneToMany(() => PostEntity, post => post.author)
  posts: PostEntity[]
  
  // @OneToMany(() => CommentEntity, comment => comment.user)
  // comments: CommentEntity[]

}
