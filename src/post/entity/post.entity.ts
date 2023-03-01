import { CategoryEntity } from "src/category/entities/category.entity";
import { CommentEntity } from "src/comment/entities/comment.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("post")
export class PostEntity extends Timestamp{
  @PrimaryGeneratedColumn()
  id: number
  
  @Column({
    nullable: false,
    unique: true
  })
  title: string
  
  @Column({
    nullable: true
  })
  description: string

  @Column()
  city: string

  @Column({
    default: false
  })
  published: boolean

  @ManyToMany(() => CategoryEntity, category => category.posts, {
    cascade: ["insert"]
  })
  @JoinTable()
  categories: CategoryEntity[]

  @ManyToOne(() => UserEntity, user => user.posts)
  @JoinTable()
  user: UserEntity

  @OneToMany(() => CommentEntity, comment => comment.post)
  @JoinTable()
  comments: CommentEntity[]
}