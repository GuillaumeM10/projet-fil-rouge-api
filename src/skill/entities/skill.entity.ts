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
    unique: false
  })
  name: string;

  @Column({
    nullable: true,
    unique: false,
    default: 0
  })
  level: number;

  @Column({
    nullable: true,
    unique: false
  })
  description: string;

  @ManyToMany(() => PostEntity, post => post.skills, {
    nullable: true
  })
  posts: PostEntity[];

  @ManyToMany(() => UserDetailEntity, user => user.skills, {
    nullable: true
  })
  users: UserDetailEntity[];
}
