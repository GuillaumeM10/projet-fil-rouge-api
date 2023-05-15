import { Timestamp } from "src/Generic/timestamp.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('city')
export class CityEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  // name: string;
  // country: string;
  // description: string;

  @ManyToMany(() => UserDetailEntity, user => user.cities)
  users: UserDetailEntity;
}
