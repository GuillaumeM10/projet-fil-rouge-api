import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() queries
  ) {
    return this.userService.findAll(queries);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User() user
  ) {
    return this.userService.update(+id, updateUserDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(
    @Param('id', ParseIntPipe) id: number,
    @User() user
  ) {
    return this.userService.softDelete(+id, user);
  }
}
