import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createFileDto: CreateFileDto,
    @User() user,
    @UploadedFiles() files
  ) {
    return this.fileService.create(createFileDto, user, files);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.fileService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string, 
    @Body() updateFileDto: UpdateFileDto,
    @User() user,
    @UploadedFiles() files
  ) {
    return this.fileService.update(+id, updateFileDto, user, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(
    @Param('id') id: string,
    @User() user,
  ) {
    return this.fileService.softDelete(+id, user);
  }
}
