import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UserDetailService } from './user-detail.service';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('users-details')
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createUserDetailDto: CreateUserDetailDto,
    @UploadedFiles() files
  ) {
    return this.userDetailService.create(createUserDetailDto, files);
  }

  @Get()
  findAll() {
    return this.userDetailService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userDetailService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDetailDto: UpdateUserDetailDto,
    @UploadedFiles() files
  ) {
    return this.userDetailService.update(+id, updateUserDetailDto, files);
  }

  @Delete(':id')
  softDelete(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userDetailService.softDelete(+id);
  }
}
