import { Timestamp } from "src/Generic/timestamp.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("token_reset_password")
export class TokenResetServiceEntity extends Timestamp{
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


// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const TokenResetPassword = new Schema({
//   token:{
//     type: String,
//     required: true,
//     unique: true
//   },
//   user:{
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// })

// module.exports = mongoose.model('TokenResetPassword', TokenResetPassword)