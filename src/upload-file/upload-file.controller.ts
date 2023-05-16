import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { User } from 'src/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post()
  create(
    @Body() createUploadFileDto: CreateUploadFileDto,
    @User() user
  ) {
    return this.uploadFileService.create(createUploadFileDto, user);
  }

  @Get()
  findAll() {
    return this.uploadFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.uploadFileService.findOne(+id);
  }

  @Get(':id')
  findOneAws(@Param('id') key: string) {
    return this.uploadFileService.findOneAws(key);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string, 
    @User() user,
    @Body() updateUploadFileDto: UpdateUploadFileDto,
    @UploadedFiles() file
  ) {
    return this.uploadFileService.update(+id, updateUploadFileDto, user, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @Body('rmFromDb') rmFromDb: boolean
  ) {
    return this.uploadFileService.remove(+id, rmFromDb);
  }
}
