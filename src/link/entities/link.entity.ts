import { LinkCategoryEntity } from "src/link-category/entities/link-category.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('link')
export class LinkEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: false
  })
  name: string

  @Column({
    nullable: true,
    unique: false
  })
  link: string

  @Column({
    nullable: true,
    unique: false
  })
  description: string

  @ManyToOne(() => UserDetailEntity, user => user.links)
  user: UserDetailEntity

  @ManyToOne(() => LinkCategoryEntity, linkCategory => linkCategory.links)
  linkCategory: LinkCategoryEntity
}
