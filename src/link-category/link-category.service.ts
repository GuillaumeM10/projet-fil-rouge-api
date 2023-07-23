import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLinkCategoryDto } from './dto/create-link-category.dto';
import { UpdateLinkCategoryDto } from './dto/update-link-category.dto';
import { LinkCategoryEntity } from './entities/link-category.entity';

@Injectable()
export class LinkCategoryService {
  constructor(
    @InjectRepository(LinkCategoryEntity)
    private readonly linkCategoryRepository: Repository<LinkCategoryEntity>
  ) {}

  async create(createLinkCategoryDto: CreateLinkCategoryDto, user) {
    try{

      if(user.role === 'admin') {
        return await this.linkCategoryRepository.save(createLinkCategoryDto)
      }else{
        return {message: 'You are not authorized to perform this action'};
      }
    }catch(error){
      console.log(error);
      return error.detail;
    }
  }

  async findAll() {
    const linkCategories = await this.linkCategoryRepository
            .createQueryBuilder('linkCategory')
            .leftJoinAndSelect('linkCategory.links', 'links')
            .select([
              'linkCategory.id', 'linkCategory.name', 'linkCategory.icon', 'linkCategory.deletedAt', 'linkCategory.updatedAt', 'linkCategory.createdAt',
              'links.id', 'links.name', 'links.url'
            ])
            .orderBy('linkCategory.id', 'DESC')
            .getMany();

    try{
      return linkCategories;
    }catch(error){
      console.log(error);
      return error.detail;
    }
  }

  async findOne(id: number) {
    const linkCategory = await this.linkCategoryRepository
            .createQueryBuilder('linkCategory')
            .leftJoinAndSelect('linkCategory.links', 'links')
            .select([
              'linkCategory.id', 'linkCategory.name', 'linkCategory.icon', 'linkCategory.deletedAt', 'linkCategory.updatedAt', 'linkCategory.createdAt',
              'links.id', 'links.name', 'links.url'
            ])
            .where('linkCategory.id = :id', { id })
            .getOne();

    if(linkCategory !== null){
      return linkCategory;    
    }else{
      throw new NotFoundException(`Link #${id} not found`);
    }
  }

  async update(id: number, updateLinkCategoryDto: UpdateLinkCategoryDto, user) {
    const linkCategory = await this.findOne(id);
    const updatedLinkCategory =  { ...linkCategory, ...updateLinkCategoryDto };

    if(user.role === 'admin') {
      try{
        await this.linkCategoryRepository.save(updatedLinkCategory);
      }catch(error){
        console.log(error);
        return error.detail;
      }
    }else{
      return {message: 'You are not authorized to perform this action'};
    }

    return updatedLinkCategory;
  }

  async softDelete(id: number, user) {
    const linkCategory = await this.findOne(id);

    if(!linkCategory){
      return {message: `LinkCategory #${id} not found`};
    }

    if(user.role === 'admin') {

        await this.linkCategoryRepository.softDelete(linkCategory);

    }else{
      return {message: 'You are not authorized to perform this action'};
    }

    return { message: `Catégorie de lien suppimé.`};

  }
}
