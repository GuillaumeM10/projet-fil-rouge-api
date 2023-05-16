import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { UserDetailService } from './user-detail.service';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDetailDto: UpdateUserDetailDto,
    @User() user,
    @UploadedFiles() files
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
