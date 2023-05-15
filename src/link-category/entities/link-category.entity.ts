import { Timestamp } from "src/Generic/timestamp.entity";
import { LinkEntity } from "src/link/entities/link.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('link_category')
export class LinkCategoryEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: false
  })
  name: string

  // @Column({
  //   nullable: true,
  //   unique: false
  // })
  // icon: string

  @OneToMany(() => LinkEntity, link => link.linkCategory)
  links: LinkEntity[]
}
