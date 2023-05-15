import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UserDetailEntity } from './entities/user-detail.entity';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepository: Repository<UserDetailEntity>
  ){}

  async create(createUserDetailDto: CreateUserDetailDto, files: any) {

    console.log(files);
    

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
    return await this.userDetailRepository.find();
  }

  async findOne(id: number) {
    const userDetail = await this.userDetailRepository.findOneBy({ id })
    if(!userDetail){
      throw new NotFoundException(`UserDetail #${id} not found`);
    }
    return userDetail;
  }

  async update(id: number, updateUserDetailDto: UpdateUserDetailDto, files: any) {
    const userDetail = await this.findOne(id);

    if (!userDetail) {
      throw new NotFoundException(`UserDetail #${id} not found`);
    }

    console.log(files);
    console.log(id);
    

    if (files !== undefined) {
      if(files && files.length > 0){
        files.forEach(file => {
          console.log(file);
        });
      }

      updateUserDetailDto.uploadFiles = files;
    }

    const userDetailUpdate = { ...userDetail, ...updateUserDetailDto };

    await this.userDetailRepository.save(userDetailUpdate);

    return userDetailUpdate;
  }

  async softDelete(id: number) {
    const userDetail = await this.userDetailRepository.softDelete(id);
    if (!userDetail) {
      throw new NotFoundException(`UserDetail #${id} not found`);
    }
    
    return userDetail;
  }
}
