import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityService } from 'src/city/city.service';
import { SkillService } from 'src/skill/skill.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { Repository } from 'typeorm';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UserDetailEntity } from './entities/user-detail.entity';
import { ExperienceService } from 'src/experience/experience.service';
import { LinkService } from 'src/link/link.service';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepository: Repository<UserDetailEntity>,
    private readonly uploadFileService: UploadFileService,
    private readonly CityService: CityService,
    private readonly SkillService: SkillService,
    private readonly ExperienceService: ExperienceService,
    private readonly LinkService: LinkService
  ){}

  async create(createUserDetailDto: CreateUserDetailDto) {
    try{    
      return await this.userDetailRepository.save(createUserDetailDto)
    }catch(error){
      console.log(error);
    }
  }

  async findAll() {
    const userDetails = await this.userDetailRepository
      .createQueryBuilder('userDetail')
      .leftJoinAndSelect('userDetail.skills', 'skills')
      .leftJoinAndSelect('userDetail.links', 'links')
      .leftJoinAndSelect('userDetail.cities', 'cities')
      .leftJoinAndSelect('userDetail.experiences', 'experiences')
      .leftJoinAndSelect('userDetail.files', 'files')
      .leftJoinAndSelect('userDetail.personalPicture', 'personalPicture')
      .leftJoinAndSelect('userDetail.cv', 'cv')
      .leftJoinAndSelect('userDetail.banner', 'banner')
      .getMany();

    return userDetails;
  }

  async findOne(id: number) {
    const userDetail = await this.userDetailRepository.findOneBy({ id })
    if(!userDetail){
      throw new NotFoundException(`UserDetail #${id} not found`);
    }

    const userDetails = await this.userDetailRepository
      .createQueryBuilder('userDetail')
      .leftJoinAndSelect('userDetail.skills', 'skills')
      .leftJoinAndSelect('userDetail.links', 'links')
      .leftJoinAndSelect('userDetail.cities', 'cities')
      .leftJoinAndSelect('userDetail.experiences', 'experiences')
      .leftJoinAndSelect('userDetail.files', 'files')
      .leftJoinAndSelect('userDetail.cv', 'cv')
      .leftJoinAndSelect('userDetail.personalPicture', 'personalPicture')
      .leftJoinAndSelect('userDetail.banner', 'banner')
      .where('userDetail.id = :id', { id })
      .getOne();

    return userDetails;
  }

  async update(id: number, updateUserDetailDto: UpdateUserDetailDto, user, files) {  
    const userDetail = await this.userDetailRepository.findOneBy({id});

    if(updateUserDetailDto.personalPicture === "null"){
      updateUserDetailDto.personalPicture = null;
    }
    if(updateUserDetailDto.cv === "null"){
      updateUserDetailDto.cv = null;
    }
    if(updateUserDetailDto.banner === "null"){
      updateUserDetailDto.banner = null;
    }
    if(updateUserDetailDto.files === "null"){
      updateUserDetailDto.files = null;
    }

    if(updateUserDetailDto.displayedOnFeed === "true"){
      updateUserDetailDto.displayedOnFeed = true;
    }else if(updateUserDetailDto.displayedOnFeed === "false"){
      updateUserDetailDto.displayedOnFeed = false;
    }

    if(updateUserDetailDto.profilComplet === "true"){
      updateUserDetailDto.profilComplet = true;
    }else if(updateUserDetailDto.profilComplet === "false"){
      updateUserDetailDto.profilComplet = false;
    }
    
    let userDetailUpdate = { ...userDetail, ...updateUserDetailDto };

    if (!userDetail) {
      throw new NotFoundException(`UserDetail #${id} not found`);
    }

    if(files?.cv){
      const cv = await this.uploadFileService.create(files.cv[0], user);
      userDetailUpdate.cv = cv;
    }
    if(files?.banner){
      const banner = await this.uploadFileService.create(files.banner[0], user);
      userDetailUpdate.banner = banner;
    }
    if(files?.personalPicture){
      const personalPicture = await this.uploadFileService.create(files.personalPicture[0], user);
      userDetailUpdate.personalPicture = personalPicture;
    }
    if(files?.files){

      const filesData = await Promise.all(files.files.map(async file => {
        const uploadFile = await this.uploadFileService.create(file, user);
        return uploadFile;
      }));
      userDetailUpdate.files = filesData;

    }
    
    const status = updateUserDetailDto.status;
    if(status){
      const enabledValue = [
        "Etudiant",
        "Alternant",
        "Freelance",
        "Demandeur emploi",
        "Salarié",
        "Autre"
      ]
      if(!enabledValue.includes(status)){
        throw new NotFoundException(`Status #${status} not found`);
      }
    }

    if(updateUserDetailDto.cities){
      let cities = typeof updateUserDetailDto.cities === "string" ? JSON.parse(updateUserDetailDto.cities) : updateUserDetailDto.cities;
      userDetailUpdate.cities = cities;

      await Promise.all(cities.map(async (city, index) => {
        const cityData = await this.CityService.findAll({name: city.name});
        
        if(cityData[0]?.name === city.name){
          const id = cityData[0].id;
          userDetailUpdate.cities[index] = {"id": id};
        }
      }));
    }

    
    if(updateUserDetailDto.skills){
      let skills = typeof updateUserDetailDto.skills === "string" ? JSON.parse(updateUserDetailDto.skills) : updateUserDetailDto.skills;
      userDetailUpdate.skills = skills;
      
      await Promise.all(skills.map(async (skill, index) => {
        
        const skillData = await this.SkillService.getAll({name: skill.name});
        
        if(skillData[0]?.name === skill.name){
          
          const id = skillData[0].id;
          userDetailUpdate.skills[index] = {"id": id};
        }
      }));
    }

    if(updateUserDetailDto.experiences){
      let experiences = typeof updateUserDetailDto.experiences === "string" ? JSON.parse(updateUserDetailDto.experiences) : updateUserDetailDto.experiences;
      userDetailUpdate.experiences = experiences;
      
      await Promise.all(experiences.map(async (experience, index) => {
        
        const experienceData = await this.ExperienceService.findAll({companieName: experience.companieName, jobName: experience.jobName});
        
        if(
          experienceData[0]?.companieName === experience.companieName
          && experienceData[0]?.jobName === experience.jobName
        ){

          const id = experienceData[0].id;
          userDetailUpdate.experiences[index] = {"id": id};
        }
      }));
    }

    if(updateUserDetailDto.links){
      let links = typeof updateUserDetailDto.links === "string" ? JSON.parse(updateUserDetailDto.links) : updateUserDetailDto.links;
      userDetailUpdate.links = links;
      
      await Promise.all(links.map(async (link, index) => {
        
        const linkData = await this.LinkService.findAll({name: link.name});
        
        if(
          linkData[0]?.name === link.name
        ){

          const id = linkData[0].id;
          userDetailUpdate.links[index] = {"id": id};
        }
      }));
    }

    try{
      const newUserDetail = await this.userDetailRepository.save(userDetailUpdate);
      return newUserDetail;
    }catch(error){
      console.log(error);
      
      return error['detail'];
    }

  }

  async softDelete(id: number) {
    const userDetail = await this.userDetailRepository.softDelete(id);
    if (!userDetail) {
      throw new NotFoundException(`UserDetail #${id} not found`);
    }
    
    return userDetail;
  }
}
