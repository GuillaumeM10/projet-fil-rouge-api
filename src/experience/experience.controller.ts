import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createExperienceDto: CreateExperienceDto,
    @User() user
  ) {
    return this.experienceService.create(createExperienceDto, user);
  }

  @Get()
  findAll(
    @Query() queries
  ) {
    return this.experienceService.findAll(queries);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.experienceService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateExperienceDto: UpdateExperienceDto,
    @User() user
  ) {
    return this.experienceService.update(+id, updateExperienceDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(
    @Param('id') id: string,
    @User() user
  ) {
    return this.experienceService.softDelete(+id, user);
  }
}
