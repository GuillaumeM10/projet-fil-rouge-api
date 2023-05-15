import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  createPost(
    @Body() data: PostCreateDto,
    @User() user,
    @UploadedFiles() files
  ) {    
    return this.postService.createPost(data, user, files)
  }

  @Get()
  getAllPosts(
    @Query() queries
  ) {
    return this.postService.getAllPosts(queries)
  }

  @Get(':id')
  getOnePostById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.postService.getOnePostById(id)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PostUpdateDto,
    @User() user,
    @UploadedFiles() files
  ) {
    return this.postService.updatePost(id, data, user, files)
  }

  @Delete(':id')
  softDeletePost(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.postService.softDeletePost(id)
  }
}
