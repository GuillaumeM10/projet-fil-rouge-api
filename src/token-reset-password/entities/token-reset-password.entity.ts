import { Timestamp } from "src/Generic/timestamp.entity";
import { UserEntity } from "src/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('token-reset-password')
export class TokenResetPasswordEntity extends Timestamp {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  token: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

}
