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

  async create(createUserDetailDto: CreateUserDetailDto) {
    try{    
      return await this.userDetailRepository.save(createUserDetailDto)
    }catch(error){
      console.log(error);
    }
  }

  async findAll() {
    const userDetails = await this.userDetailRepository
      .createQueryBuilder('userDetail')
      .leftJoinAndSelect('userDetail.skills', 'skills')
      .leftJoinAndSelect('userDetail.links', 'links')
      .leftJoinAndSelect('userDetail.cities', 'cities')
      .leftJoinAndSelect('userDetail.experiences', 'experiences')
      .leftJoinAndSelect('userDetail.files', 'files')
      .leftJoinAndSelect('userDetail.personalPicture', 'personalPicture')
      .leftJoinAndSelect('userDetail.cv', 'uploadFiles')
      .leftJoinAndSelect('userDetail.banner', 'uploadFiles')
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
      .leftJoinAndSelect('userDetail.links', 'links')
      .leftJoinAndSelect('userDetail.cities', 'cities')
      .leftJoinAndSelect('userDetail.experiences', 'experiences')
      .leftJoinAndSelect('userDetail.files', 'files')
      .leftJoinAndSelect('userDetail.cv', 'cv')
      .leftJoinAndSelect('userDetail.personalPicture', 'personalPicture')
      .leftJoinAndSelect('userDetail.banner', 'banner')
      .where('userDetail.id = :id', { id })
      .getOne();

    return userDetails;
  }

  async update(id: number, updateUserDetailDto: UpdateUserDetailDto, user, files) {
    const userDetail = await this.userDetailRepository.findOneBy({id});
    let userDetailUpdate = { ...userDetail, ...updateUserDetailDto };

    if (!userDetail) {
      throw new NotFoundException(`UserDetail #${id} not found`);
    }
      
    if(files?.cv){
      const cv = await this.uploadFileService.create(files.cv[0], user);
      console.log("upload CV");

      userDetailUpdate.cv = cv;
    }
    if(files?.banner){
      const banner = await this.uploadFileService.create(files.banner[0], user);
      userDetailUpdate.banner = banner;
    }
    if(files.personalPicture){
      const personalPicture = await this.uploadFileService.create(files.personalPicture[0], user);
      userDetailUpdate.personalPicture = personalPicture;
    }
    if(files.files){

      const filesData = await Promise.all(files.files.map(async file => {
        const uploadFile = await this.uploadFileService.create(file, user);
        return uploadFile;
      }));
      userDetailUpdate.files = filesData;

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
