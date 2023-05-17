import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLinkCategoryDto } from './dto/create-link-category.dto';
import { UpdateLinkCategoryDto } from './dto/update-link-category.dto';
import { LinkCategoryEntity } from './entities/link-category.entity';

@Injectable()
export class LinkCategoryService {
  constructor(
    @InjectRepository(LinkCategoryEntity)
    private linkCategoryRepository: Repository<LinkCategoryEntity>
  ) {}

  create(createLinkCategoryDto: CreateLinkCategoryDto, user) {
    return 'This action adds a new linkCategory';
  }

  findAll() {
    return `This action returns all linkCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} linkCategory`;
  }

  update(id: number, updateLinkCategoryDto: UpdateLinkCategoryDto) {
    return `This action updates a #${id} linkCategory`;
  }

  softDelete(id: number) {
    return `This action removes a #${id} linkCategory`;
  }
}
