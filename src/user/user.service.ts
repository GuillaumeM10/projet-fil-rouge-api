import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
const bcrypt = require('bcrypt');
const salt = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = createUserDto
    user.password = bcrypt.hashSync(user.password, salt)
    try{
      const newUser = await this.userRepository.save(user)
      return newUser
    }catch(err) {
      return err['detail']
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if(user === null){
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if(user === null){
      throw new NotFoundException(`User ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const userUpdate = { ...user, ...updateUserDto };

    await this.userRepository.save(userUpdate);

    return userUpdate;
  }

  async remove(id: number) {
    return await this.userRepository.softDelete(id);
  }
}
