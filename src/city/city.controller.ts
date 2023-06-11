import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCityDto: CreateCityDto
  ) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAll(
    @Query() queries
  ) {
    return this.cityService.findAll(queries);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.cityService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateCityDto: UpdateCityDto
  ) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(
    @Param('id') id: string,
    @User() user
  ) {
    return this.cityService.softDelete(+id, user);
  }
}
