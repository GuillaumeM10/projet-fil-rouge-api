import { Injectable } from '@nestjs/common';
import { CreateLinkCategoryDto } from './dto/create-link-category.dto';
import { UpdateLinkCategoryDto } from './dto/update-link-category.dto';

@Injectable()
export class LinkCategoryService {
  create(createLinkCategoryDto: CreateLinkCategoryDto) {
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

  remove(id: number) {
    return `This action removes a #${id} linkCategory`;
  }
}
