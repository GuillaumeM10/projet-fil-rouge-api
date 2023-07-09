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
    
    if(user.email === "" || user.email === null || user.email === undefined || !user.email){
      throw new NotFoundException(`Email obligatoire.`);
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

  async findAll(queries) {
    const { page, limit, search } = queries;

    const query = this.userRepository
                    .createQueryBuilder('user')
                    .leftJoinAndSelect('user.userDetail', 'userDetail')
                    // .leftJoinAndSelect('userDetail.skills', 'skills')
                    // .leftJoinAndSelect('userDetail.links', 'links')
                    // .leftJoinAndSelect('userDetail.cities', 'cities')
                    // .leftJoinAndSelect('userDetail.experiences', 'experiences')
                    // .leftJoinAndSelect('userDetail.files', 'files')
                    // .leftJoinAndSelect('userDetail.cv', 'cv')
                    .leftJoinAndSelect('userDetail.personalPicture', 'personalPicture')
                    // .leftJoinAndSelect('userDetail.banner', 'banner') 
                    // .leftJoinAndSelect('user.comments', 'comments')
                    // .leftJoinAndSelect('user.replies', 'replies')
                    // .leftJoinAndSelect('user.posts', 'posts')

    if(search){
      query
        .where('user.firstName ILIKE :search', { search: `%${search}%` })
        .orWhere('user.lastName ILIKE :search', { search: `%${search}%` })
        
    }

    if(page && limit){
      query
        .skip(page * limit)
        .take(limit)
    }

    const user = await query
                        .orderBy('user.id', 'DESC') 
                        .getMany();

    if(user === null){
      throw new NotFoundException(`Pas de résultats`);
    }
    return user;
    // return await this.userRepository.find();
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
    // const user = await this.userRepository.findOneBy({ email });
    // get one by email join userDetail
    const user = await this.userRepository
                    .createQueryBuilder('user')
                    .leftJoinAndSelect('user.userDetail', 'userDetail')
                    .where('user.email = :email', { email })
                    .getOne();


    if(user === null){
      throw new NotFoundException(`Impossible de trouver l'utilisateur ${email}.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, user) {
    const getUser = await this.findOne(id);

    if(getUser.id !== user.id){
      if (!getUser) {
        throw new NotFoundException(`Impossible de trouver l'utilisateur #${id}.`);
      }

      const userUpdate = { ...getUser, ...updateUserDto };

      await this.userRepository.save(userUpdate);

      return userUpdate;
    }else{
      throw new NotFoundException(`Impossible de modifier votre compte.`);
    }

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

  async softDelete(id: number, user) {    
    const getUser = await this.findOne(id);

    if(getUser.id !== user.id){

      if(getUser.userDetail){
        await this.userDetailService.softDelete(getUser.userDetail.id);
      }
      const userToRemove = await this.userRepository.softDelete(id);

      if (!userToRemove) {
        throw new NotFoundException(`Impossible de trouver l'utilisateur #${id}.`);
      }

      return { message: `L'utilisateur #${id} a été supprimé.`};
    }else{
      throw new NotFoundException(`Impossible de supprimer votre compte.`);
    }
  }
}
