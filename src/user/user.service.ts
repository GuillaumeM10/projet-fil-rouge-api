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

    if(!user.password){
      throw new NotFoundException(`Toutes les informations ne sont pas renseignées.`);
    }

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
                    .leftJoinAndSelect('userDetail.skills', 'skills')
                    .leftJoinAndSelect('userDetail.links', 'links')
                    .leftJoinAndSelect('userDetail.cities', 'cities')
                    .leftJoinAndSelect('userDetail.experiences', 'experiences')
                    .leftJoinAndSelect('userDetail.files', 'files')
                    .leftJoinAndSelect('userDetail.cv', 'cv')
                    .leftJoinAndSelect('userDetail.personalPicture', 'personalPicture')
                    .leftJoinAndSelect('userDetail.banner', 'banner') 
                    .leftJoinAndSelect('user.comments', 'comments')
                    .leftJoinAndSelect('user.replies', 'replies')
                    .leftJoinAndSelect('user.posts', 'posts')
                    .where('user.id = :id', { id })
                    .getOne();
    if(user === null){
      throw new NotFoundException(`Impossible de trouver l'utilisateur #${id}.`);
    }
    return user;
  }

  
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if(user === null){
      throw new NotFoundException(`Impossible de trouver l'utilisateur ${email}.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`Impossible de trouver l'utilisateur #${id}.`);
    }

    const userUpdate = { ...user, ...updateUserDto };

    await this.userRepository.save(userUpdate);

    return userUpdate;
  }

  async updatePassword(password: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneByEmail(updateUserDto.email);

    if (!user) {
      throw new NotFoundException(`Impossible de trouver l'utilisateur ${updateUserDto.email}.`);
    }

    const userUpdate = { ...user, ...updateUserDto };
    userUpdate.password = bcrypt.hashSync(password, salt)

    await this.userRepository.save(userUpdate);

    return userUpdate;
  }

  async softDelete(id: number) {    
    const user = await this.findOne(id);
    if(user.userDetail){
      await this.userDetailService.softDelete(user.userDetail.id);
    }
    const userToRemove = await this.userRepository.softDelete(id);

    if (!userToRemove) {
      throw new NotFoundException(`Impossible de trouver l'utilisateur #${id}.`);
    }

    return { message: `L'utilisateur #${id} a été supprimé.`};
  }
}
