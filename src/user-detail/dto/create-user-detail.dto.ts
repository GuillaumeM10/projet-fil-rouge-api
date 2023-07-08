import { CityEntity } from "src/city/entities/city.entity";
import { ExperienceEntity } from "src/experience/entities/experience.entity";
import { LinkEntity } from "src/link/entities/link.entity";
import { SkillEntity } from "src/skill/entities/skill.entity";
import { UploadFileEntity } from "src/upload-file/entities/upload-file.entity";
import { UserEntity } from "src/user/entities/user.entity";

export class CreateUserDetailDto {
  id?: number;
  user?: UserEntity;
  formation?: string;
  school?: string;
  contactEmail?: string;
  displayedOnFeed?: any;
  description?: string;
  address?: string;
  country?: string;
  phone?: string;
  profilComplet?: any;
  status?: string;
  range?: number;
  skills?: any;
  banner?: any;
  personalPicture?: any;
  cv?: any;
  files?: UploadFileEntity[];
  experiences?: any;
  links?: any;
  cities?: any;
}
