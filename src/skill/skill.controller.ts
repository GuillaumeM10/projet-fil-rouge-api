import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Put, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createSkillDto: CreateSkillDto,
    @User() user
  ) {
    return this.skillService.create(createSkillDto, user);
  }

  @Get()
  getAll(
    @Query() queries
  ) {
    return this.skillService.getAll(queries);
  }

  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.skillService.getOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSkillDto: UpdateSkillDto,
    @User() user
  ) {
    return this.skillService.update(+id, updateSkillDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(
    @Param('id', ParseIntPipe) id: number,
    @User() user
  ) {
    return this.skillService.softDelete(+id, user);
  }
}
