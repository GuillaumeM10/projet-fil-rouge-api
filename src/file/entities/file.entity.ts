import { PartialType } from "@nestjs/mapped-types";
import { Timestamp } from "src/Generic/timestamp.entity";
import { UploadFileEntity } from "src/upload-file/entities/upload-file.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('file')
export class FileEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDetailEntity, user => user.files, {
    nullable: true,
  })
  userDetail: UserDetailEntity;

  // @OneToMany(() => UploadFileEntity, files => files.files ,{
  //   cascade: ["insert"],
  //   nullable: true,
  // })
  // @JoinColumn()
  // files: UploadFileEntity[];

  

}
