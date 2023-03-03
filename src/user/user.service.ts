import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetailService } from 'src/user-detail/user-detail.service';
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
    private readonly userRepository: Repository<UserEntity>,
    private userDetailService: UserDetailService,
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = createUserDto
    user.password = bcrypt.hashSync(user.password, salt)
    try{
      const newUser = await this.userRepository.save(user)
      return newUser
    }catch(err) {
      // const error = { "error" : err['detail'] }
      // return error
      throw new ConflictException('Cette adresse email est déjà utilisée');
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    // const user = await this.userRepository.findOneBy({ id });
    const user = await this.userRepository
                    .createQueryBuilder('user')
                    .leftJoinAndSelect('user.userDetail', 'userDetail')
                    .where('user.id = :id', { id })
                    .getOne();
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
    const user = await this.findOne(id);
    if(user.userDetail){
      await this.userDetailService.remove(user.userDetail.id);
    }
    const userToRemove = await this.userRepository.softDelete(id);

    if (!userToRemove) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return { message: `User #${id} deleted`};
  }
}
