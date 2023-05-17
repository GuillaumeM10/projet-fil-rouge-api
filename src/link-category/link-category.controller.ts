import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { LinkCategoryService } from './link-category.service';
import { CreateLinkCategoryDto } from './dto/create-link-category.dto';
import { UpdateLinkCategoryDto } from './dto/update-link-category.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('link-categories')
export class LinkCategoryController {
  constructor(private readonly linkCategoryService: LinkCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createLinkCategoryDto: CreateLinkCategoryDto,
    @User() user
  ) {
    return this.linkCategoryService.create(createLinkCategoryDto, user);
  }

  @Get()
  findAll() {
    return this.linkCategoryService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.linkCategoryService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateLinkCategoryDto: UpdateLinkCategoryDto
  ) {
    return this.linkCategoryService.update(+id, updateLinkCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(
    @Param('id') id: string
  ) {
    return this.linkCategoryService.softDelete(+id);
  }
}
