import { Timestamp } from "src/Generic/timestamp.entity";
import { PostEntity } from "src/post/entity/post.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('skill')
export class SkillEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  name: string;

  @Column({
    nullable: false,
    unique: false
  })
  level: number;

  @Column({
    nullable: false,
    unique: false
  })
  description: string;

  @ManyToMany(() => PostEntity, post => post.skills)
  posts: PostEntity;

  @ManyToMany(() => UserDetailEntity, user => user.skills)
  users: UserDetailEntity;
}
