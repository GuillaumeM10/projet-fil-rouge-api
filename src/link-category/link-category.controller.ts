import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkCategoryService } from './link-category.service';
import { CreateLinkCategoryDto } from './dto/create-link-category.dto';
import { UpdateLinkCategoryDto } from './dto/update-link-category.dto';

@Controller('link-category')
export class LinkCategoryController {
  constructor(private readonly linkCategoryService: LinkCategoryService) {}

  @Post()
  create(@Body() createLinkCategoryDto: CreateLinkCategoryDto) {
    return this.linkCategoryService.create(createLinkCategoryDto);
  }

  @Get()
  findAll() {
    return this.linkCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkCategoryDto: UpdateLinkCategoryDto) {
    return this.linkCategoryService.update(+id, updateLinkCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linkCategoryService.remove(+id);
  }
}
