import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityEntity } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    try{
        return await this.cityRepository.save(createCityDto);
    }catch(err){
        console.log(err);
        return err.detail;
    }
  }

  async findAll() {
    const cities = await this.cityRepository.find();
    return cities;
  }

  async findOne(id: number) {
    const city = await this.cityRepository.findOneBy({id});
    if(city !== null){
      return city;
    }else{
      throw new NotFoundException(`City #${id} not found`);
    }
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);
    if(city === null){
      throw new NotFoundException(`City #${id} not found`);
    }

    const updateCity = { ...city, ...updateCityDto };
    return await this.cityRepository.save(updateCity);
  }

  async softDelete(id: number, user) {
    
    if(user.role === 'admin'){
      const city = await this.findOne(id);
      if(city === null){
        throw new NotFoundException(`City #${id} not found`);
      }
      return await this.cityRepository.save(city);
    }else{
      return { message: 'You are not authorized to delete this city'};
    }
  }
}
