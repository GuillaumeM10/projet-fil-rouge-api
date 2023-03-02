import { Timestamp } from "src/Generic/timestamp.entity";
import { SkillEntity } from "src/skill/entities/skill.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_detail')
export class UserDetailEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, user => user.userDetail)
  user: UserEntity; 


  // @ManyToMany(() => FileEntity, file => file.userDetail, {
  //   cascade: ["insert"]
  // })
  // @JoinTable()
  // files: FileEntity[]

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
    default: true
  })
  displayedOnFeed: boolean;
  
  @Column({
    nullable: true,
    unique: false
  })
  description: string;
  
  @Column({
    nullable: true,
    unique: false
  })
  address: string;

  @Column({
    nullable: false,
    unique: false
  })
  country: string;

  @Column({
    nullable: true,
    unique: false
  })
  phone: string;

  @Column({
    nullable: false,
    unique: false
  })
  status: string; 

  @Column({
    nullable: true,
    unique: false
  })
  range :number;

  // @ManyToMany(() => SkillEntity, skill => skill.users) 
  // skills: SkillEntity;

  // banner: FileEntity;
  // personalPicture: FileEntity;
  // cv: FileEntity;
  // experiences: ExperienceEntity;
  // links: LinkEntity;
  // cities: CityEntity; 

}
