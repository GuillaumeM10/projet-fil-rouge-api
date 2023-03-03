import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

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

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(
    @Body() data: PostCreateDto,
    @User() user
  ) {
    return this.postService.createPost(data, user)
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PostUpdateDto
  ) {
    return this.postService.updatePost(id, data)
  }

  @Delete(':id')
  softDeletePost(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.postService.softDeletePost(id)
  }
}
