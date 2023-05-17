import { Timestamp } from "src/Generic/timestamp.entity";
import { LinkEntity } from "src/link/entities/link.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('link_category')
export class LinkCategoryEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: true
  })
  name: string

  @Column({
    nullable: true,
    unique: false
  })
  icon: string

  @OneToMany(() => LinkEntity, link => link.linkCategory)
  @JoinColumn()
  links: LinkEntity[]
}
