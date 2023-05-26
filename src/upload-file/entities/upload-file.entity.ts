import { Timestamp } from "src/Generic/timestamp.entity";
import { PostEntity } from "src/post/entity/post.entity";
import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, ManyToMany } from "typeorm";

@Entity('uploadFile')
export class UploadFileEntity extends Timestamp {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        nullable: true,
    })
    ETag: string;

    @Column()
    Location: string;

    @Column({
        nullable: true,
    })
    key: string;

    @Column({
        nullable: true,
    })
    Key: string;

    @Column({
        nullable: true,
    })
    Bucket: string;

    @ManyToOne(() => PostEntity, post => post.uploadFiles, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    post: PostEntity;

    @ManyToMany(() => UserDetailEntity, user => user.files)
    userDetails: UserDetailEntity[];



}
