import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinkEntity } from './entities/link.entity';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepository: Repository<LinkEntity>
  ) {}

  async create(createLinkDto: CreateLinkDto, user) {
    try{
        
        createLinkDto.user = user.id;
        return await this.linkRepository.save(createLinkDto);

    }catch(err){
        console.log(err);
        return err.detail;
    }
  }

  async findAll(queries) {
    let { name, url } = queries;

    const query = await this.linkRepository
            .createQueryBuilder('link')
            .leftJoinAndSelect('link.user', 'user', 'user.id = link.userId')
            .select([
              'link.id', 'link.name', 'link.url', 'link.description', 'link.deletedAt', 'link.updatedAt', 'link.createdAt',
              // 'user.firstName', 'user.lastName'
            ])

    if(name && url){
      query.andWhere('link.name ILIKE :name', { name : `%${name}%` })
      query.andWhere('link.url ILIKE :url', { url : `%${url}%` })
    }else{
      if( name ){
        query.andWhere('link.name ILIKE :name', { name : `%${name}%` })
      }
      
      if( url ){
        query.andWhere('link.url ILIKE :url', { url : `%${url}%` })
      }
    }

    try{
      const links = await query.getMany();
      return links;
    }catch(err){
      console.log(err);
      return err.detail;
    }
  }

  async findOne(id: number) {
    const link = await this.linkRepository
            .createQueryBuilder('link')
            .leftJoinAndSelect('link.user', 'user', 'user.id = link.userId')
            .select([
              'link.id', 'link.name', 'link.url', 'link.description', 'link.deletedAt', 'link.updatedAt', 'link.createdAt',
              // 'user.firstName', 'user.lastName'
            ])
            .where('link.id = :id', { id })
            .getOne();

    if(link !== null){
      return link;    
    }else{
      throw new NotFoundException(`Link #${id} not found`);
    }
  }

  async update(id: number, updateLinkDto: UpdateLinkDto) {
    const link = await this.findOne(id);

    if (!link) {
      throw new NotFoundException(`Link #${id} not found`);
    }

    const updatedLink = { ...link, ...updateLinkDto };

    try{
      await this.linkRepository.save(updatedLink);
    }catch(err){ 
      console.log(err);
      return err.detail;
    }

    return updatedLink;
  }

  async softDelete(id: number) {
    const link = await this.findOne(id);

    if (!link) {
      throw new NotFoundException(`Link #${id} not found`);
    }

    await this.linkRepository.softDelete(id)

    return { message: `Lien suppimé.`};
  }
}
