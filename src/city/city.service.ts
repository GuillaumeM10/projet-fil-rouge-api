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

  async create(createCityDto: CreateCityDto, user) {
    if (user) {
      try{
        const city = this.cityRepository.create(createCityDto);
        return await this.cityRepository.save(city);
      }catch(err){
          console.log(err);
          return err.detail;
      }
    }else{
      throw new NotFoundException(`User not found`);
    }
  }

  async findAll(queries) {
    let { name } = queries;

    const query = this.cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.users', 'users')
      .leftJoinAndSelect('city.posts', 'posts');
      
    if(name){
      query.andWhere('city.name = :name', { name });
    }

    try{
      const cities = await query.getMany();
      return cities;
    }catch(err){
      throw new NotFoundException(`no cities found`);
    }

  }

  async findOne(id: number) {
    // const city = await this.cityRepository.findOneBy({id});
    const city = await this.cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.users', 'users')
      .leftJoinAndSelect('city.posts', 'posts')
      .where('city.id = :id', { id })
      .getOne();

    if(city !== null){
      return city;
    }else{
      throw new NotFoundException(`City #${id} not found`);
    }
  }

  async findOneByName(name: string) {
    const city = await this.cityRepository.findOneBy({name});
    if(city !== null){
      return city;
    }else{
      throw new NotFoundException(`City ${name} not found`);
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
