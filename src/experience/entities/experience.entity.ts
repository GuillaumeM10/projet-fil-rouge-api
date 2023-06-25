import { Timestamp } from "src/Generic/timestamp.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('experience')
export class ExperienceEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
    unique: false
  })
  companieName: string

  @Column({
    nullable: true,
    unique: false
  })
  jobName: string

  @Column({
    nullable: true,
    unique: false
  })
  startDate: string

  @Column({
    nullable: true,
    unique: false
  })
  endDate: string

  @Column({
    nullable: true,
    unique: false,
    default: false
  })
  actualyIn: boolean

  @Column({
    nullable: true,
    unique: false
  })
  type: string

  @ManyToOne(() => UserDetailEntity, user => user.experiences, {
    onDelete: 'CASCADE',
    cascade: ["insert"],
    nullable: true
  })
  @JoinColumn()
  user: UserDetailEntity
  
}
