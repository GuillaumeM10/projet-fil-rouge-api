import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { User } from 'src/decorator/user.decorator';

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
  update(
    @Param('id') id: string, 
    @User() user,
    @Body() updateUploadFileDto: UpdateUploadFileDto
  ) {
    return this.uploadFileService.update(+id, updateUploadFileDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadFileService.remove(+id);
  }
}
