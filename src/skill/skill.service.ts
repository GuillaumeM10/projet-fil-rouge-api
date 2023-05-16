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

  getAll(queries) {
    const query = queries
    ? {where: queries}
    : {};
    return this.skillRepository.find(query);
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
        const skill = this.skillRepository.create(updateSkillDto);
        return await this.skillRepository.save(skill);
      }catch(err){
        throw new ConflictException('Ce skill existe déjà');
      }
    }else{
      throw new NotFoundException({message: 'Skill not found'});
    }
  }

  softDelete(id: number, user) {
    return `This action removes a #${id} skill`;
  }
}
