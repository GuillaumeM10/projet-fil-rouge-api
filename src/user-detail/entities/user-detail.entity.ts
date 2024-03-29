import { CityEntity } from "src/city/entities/city.entity";
import { ExperienceEntity } from "src/experience/entities/experience.entity";
import { Timestamp } from "src/Generic/timestamp.entity";
import { LinkEntity } from "src/link/entities/link.entity";
import { SkillEntity } from "src/skill/entities/skill.entity";
import { UploadFileEntity } from "src/upload-file/entities/upload-file.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_detail')
export class UserDetailEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, user => user.userDetail)
  user: UserEntity; 

  @Column({
    nullable: true,
    unique: false
  })
  formation: string;

  @Column({
    nullable: true,
    unique: false
  })
  school: string;

  @Column({
    nullable: true,
    unique: false
  })
  contactEmail: string;

  @Column({
    nullable: true,
    default: false
  })
  profilComplet: boolean;

  @Column({
    nullable: true,
    default: true
  })
  displayedOnFeed: boolean;
  
  @Column({
    nullable: true,
    unique: false
  })
  description: string;
  
  // @Column({
  //   nullable: true,
  //   unique: false
  // })
  // address: string;

  @Column({
    nullable: true,
    unique: false
  })
  country: string;

  @Column({
    nullable: true,
    unique: false
  })
  phone: string;

  @Column({
    nullable: true,
    unique: false
  })
  status: string;

  @Column({
    nullable: true,
    unique: false
  })
  range :number;
  
  @OneToOne(() => UploadFileEntity, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE",
    nullable: true
  })
  @JoinColumn()
  banner: UploadFileEntity;

  @OneToOne(() => UploadFileEntity, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE",
    nullable: true
  })
  @JoinColumn()
  personalPicture: UploadFileEntity;

  @OneToOne(() => UploadFileEntity, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE",
    nullable: true
  })
  @JoinColumn()
  cv: UploadFileEntity;

  @ManyToMany(() => UploadFileEntity, uploadFile => uploadFile.userDetails, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE",
    nullable: true
  })
  @JoinTable()
  files: UploadFileEntity[];
  
  @OneToMany(() => ExperienceEntity, experience => experience.user, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE",
    nullable: true
  })
  @JoinColumn()
  experiences: ExperienceEntity[];
  
  @OneToMany(() => LinkEntity, link => link.user, {
    cascade: ["insert", "update", "remove"],
    onDelete: "CASCADE",
    nullable: true
  })
  @JoinColumn()
  links: LinkEntity[];
  
  @ManyToMany(() => CityEntity, city => city.users, {
    cascade: ["insert"],
    nullable: true
  }) 
  @JoinTable()
  cities: CityEntity[];

  @ManyToMany(() => SkillEntity, skill => skill.users, {
    cascade: ["insert"],
    nullable: true
  }) 
  @JoinTable()
  skills: SkillEntity[];
}
