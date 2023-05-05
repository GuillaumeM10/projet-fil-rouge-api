import { CommentEntity } from "src/comment/entities/comment.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { SkillEntity } from "src/skill/entities/skill.entity";
import { UploadFileEntity } from "src/upload-file/entities/upload-file.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("post")
export class PostEntity extends Timestamp{
  @PrimaryGeneratedColumn()
  id: number
  
  @Column({
    nullable: false,
    unique: false
  })
  content: string

  @Column({
    default: true
  })
  published: boolean

  // @ManyToMany(() => FileEntity, file => file.posts, {
  //   cascade: ["insert"]
  // })
  // @JoinTable()
  // files: FileEntity[]

  // @ManyToMany(() => SkillEntity, skill => skill.posts, {
  //   cascade: ["insert"]
  // })
  // @JoinTable()
  // skills: SkillEntity[]

  @ManyToOne(() => UserEntity, user => user.posts)
  @JoinTable()
  author: UserEntity

  @OneToMany(() => UploadFileEntity, uploadFile => uploadFile.post, {
    cascade: true
  })
    @JoinColumn()
    uploadFiles: UploadFileEntity[];

  // @OneToMany(() => CommentEntity, comment => comment.post)
  // @JoinTable()
  // comments: CommentEntity[]
}