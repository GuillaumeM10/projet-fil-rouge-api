import { Timestamp } from "src/Generic/timestamp.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('city')
export class CityEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  name: string;

  @ManyToMany(() => UserDetailEntity, user => user.cities)
  @JoinTable()
  users: UserDetailEntity[];
}
