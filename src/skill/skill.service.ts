import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillEntity } from './entities/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>
  ) {}

  async create(createSkillDto: CreateSkillDto, user) {
    if (user) {
      try{
        const skill = this.skillRepository.create(createSkillDto);
        return await this.skillRepository.save(skill);
      }catch(err){
        throw new ConflictException('Ce skill existe déjà');
      }
    }else{
      throw new NotFoundException({message: 'User not found'});
    }
  }

  async getAll(queries) {
    let { name, level, description } = queries;
    
    const query = this.skillRepository
      .createQueryBuilder('skill')

    if(name){
      query.andWhere('skill.name = :name', { name });
    }

    if(level){
      query.andWhere('skill.level = :level', { level });
    }

    if(description){
      query.andWhere('skill.description = :description', { description });
    }

    try{
      const skills = await query.getMany();
      return skills;
    }catch(err){
      throw new NotFoundException(`no skills found`);
    }
  }

  getOne(id: number) {
    if (id) {
      return this.skillRepository.findOneBy({id});
    }else{
      throw new NotFoundException({message: 'Skill not found'});
    }
  }

  async update(id: number, updateSkillDto: UpdateSkillDto, user) {

    const skill = await this.skillRepository.findOneBy({id});
    const updateSkill = { ...skill, ...updateSkillDto };

    if(updateSkill){
      try{

        return await this.skillRepository.save(updateSkill);

      }catch(err){

        throw new ConflictException('Ce skill existe déjà');

      }
    }else{

      throw new NotFoundException({message: 'Skill not found'});
      
    }

  }

  async softDelete(id: number, user) {
    const skill = await this.skillRepository.findOneBy({id});

    if (id && skill) {
      await this.skillRepository.softDelete({id});
      return skill;
    }else{
      throw new NotFoundException({message: 'Skill not found'});
    }
  }
}
