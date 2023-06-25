import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceEntity } from './entities/experience.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private readonly experienceRepository: Repository<ExperienceEntity>
  ) {}

  async create(createExperienceDto: CreateExperienceDto, user) {
    try{
      createExperienceDto.user = user.id;
      return await this.experienceRepository.save(createExperienceDto);
    }catch(err){
      console.log(err);
      return err.detail;
    }
  }

  async findAll(queries) {
    let { companieName, jobName } = queries;

    const query = await this.experienceRepository
            .createQueryBuilder('experience')
            .leftJoinAndSelect('experience.user', 'user', 'user.id = experience.userId')
            .select([
              'experience.id', 'experience.companieName', 'experience.jobName', 'experience.startDate', 'experience.endDate', 'experience.actualyIn', 'experience.type', 'experience.deletedAt', 'experience.updatedAt', 'experience.createdAt',
              'user.id'
            ])

    if(companieName && jobName){
      query.andWhere('experience.companieName ILIKE :companieName', { companieName : `%${companieName}%` })
      query.andWhere('experience.jobName ILIKE :jobName', { jobName : `%${jobName}%` })
    }else{      
      if( companieName ){
        query.andWhere('experience.companieName ILIKE :companieName', { companieName : `%${companieName}%` })
      }
      
      if( jobName ){
        query.andWhere('experience.jobName ILIKE :jobName', { jobName : `%${jobName}%` })
      }
    }

    try{
      const experiences = await query.getMany();
      return experiences;
    }catch(err){
      console.log(err);
      throw new NotFoundException(`Experience not found`);
    }
    
  }

  async findOne(id: number) {
    const experience = await this.experienceRepository
            .createQueryBuilder('experience')
            .leftJoinAndSelect('experience.user', 'user', 'user.id = experience.userId')
            .select([
              'experience.id', 'experience.companieName', 'experience.jobName', 'experience.startDate', 'experience.endDate', 'experience.actualyIn', 'experience.type', 'experience.deletedAt', 'experience.updatedAt', 'experience.createdAt',
              'user.id'
            ])
            .where('experience.id = :id', { id })
            .getOne();

    if(experience !== null){
      return experience;    
    }else{
      throw new NotFoundException(`Experience #${id} not found`);
    }
  }

  async update(id: number, updateExperienceDto: UpdateExperienceDto, user) {
    console.log(id);
    const experience = await this.findOne(id);
    
    if(experience !== null){
      if(experience.user.id === user.id){

        const updatedExperience = { ...experience, ...updateExperienceDto };
        console.log(updatedExperience);
        

        return await this.experienceRepository.save(updatedExperience);

      }else{

        return { message : 'You are not authorized to update this experience' }

      }
    }else{
      throw new NotFoundException(`Experience #${id} not found`);
    }

  }

  async softDelete(id: number, user) {
    const experience = await this.findOne(id);

    if(experience !== null){
      if(experience.user.id === user.id){
        await this.experienceRepository.softDelete(id);
        return { message : 'Experience supprimé.' } 
      }else{
        return { message : 'You are not authorized to delete this experience' }
      }
    }else{
      throw new NotFoundException(`Experience #${id} not found`);
    }
  }
}
