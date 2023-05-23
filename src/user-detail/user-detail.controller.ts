import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { UserDetailService } from './user-detail.service';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';
import { Express } from 'express';

@Controller('users-details')
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @Post()
  create(
    @Body() createUserDetailDto: CreateUserDetailDto
  ) {
    return this.userDetailService.create(createUserDetailDto);
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'files'},
    {name: 'cv'},
    {name: 'banner'}
  ]))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDetailDto: UpdateUserDetailDto,
    @User() user,
    @UploadedFiles() files: {
      files?: Express.Multer.File[],
      cv?: Express.Multer.File[],
      banner?: Express.Multer.File[]
    }
  ) {
    return this.userDetailService.update(+id, updateUserDetailDto, user, files);
  }

  @Delete(':id')
  softDelete(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userDetailService.softDelete(+id);
  }
}
