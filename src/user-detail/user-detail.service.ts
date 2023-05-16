import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { Repository } from 'typeorm';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UserDetailEntity } from './entities/user-detail.entity';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepository: Repository<UserDetailEntity>,
    private readonly uploadFileService: UploadFileService
  ){}

  async create(createUserDetailDto: CreateUserDetailDto, files: any) {

    // console.log(files);
    

    if (files !== undefined) {
      if(files && files.length > 0){
        files.forEach(file => {
          console.log(file);
        });
      }

      createUserDetailDto.uploadFiles = files;
    }

    try{
      return await this.userDetailRepository.save(createUserDetailDto);
    }catch(error){
      console.log(error);
    }

    // return await this.userDetailRepository.save(createUserDetailDto);
  }

  async findAll() {
    const userDetails = await this.userDetailRepository
      .createQueryBuilder('userDetail')
      .leftJoinAndSelect('userDetail.skills', 'skills')
      // .leftJoinAndSelect('userDetail.experiences', 'experiences')
      // .leftJoinAndSelect('userDetail.uploadFiles', 'uploadFiles')
      .getMany();

    return userDetails;
  }

  async findOne(id: number) {
    const userDetail = await this.userDetailRepository.findOneBy({ id })
    if(!userDetail){
      throw new NotFoundException(`UserDetail #${id} not found`);
    }

    const userDetails = await this.userDetailRepository
      .createQueryBuilder('userDetail')
      .leftJoinAndSelect('userDetail.skills', 'skills')
      // .leftJoinAndSelect('userDetail.experiences', 'experiences')
      // .leftJoinAndSelect('userDetail.uploadFiles', 'uploadFiles')
      .where('userDetail.id = :id', { id })
      .getOne();

    return userDetails;
  }

  async update(id: number, updateUserDetailDto: UpdateUserDetailDto, user, files: any) {
    const userDetail = await this.userDetailRepository.findOneBy({id});
    const userDetailUpdate = { ...userDetail, ...updateUserDetailDto };

    if (!userDetail) {
      throw new NotFoundException(`UserDetail #${id} not found`);
    }

    // console.log(id);
    
    if (files !== undefined) {
      let filesData = await Promise.all(files.map(async file => {
          const uploadFile = await this.uploadFileService.create(file, user);
          return uploadFile;
      }));
      
      userDetailUpdate.uploadFiles = filesData;
    }

    
    try{
      return await this.userDetailRepository.save(userDetailUpdate);
    }catch(error){
      console.log("error", error);
      return error['detail'];
    }

  }

  async softDelete(id: number) {
    const userDetail = await this.userDetailRepository.softDelete(id);
    if (!userDetail) {
      throw new NotFoundException(`UserDetail #${id} not found`);
    }
    
    return userDetail;
  }
}
