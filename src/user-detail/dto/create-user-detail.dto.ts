import { CityEntity } from "src/city/entities/city.entity";
import { ExperienceEntity } from "src/experience/entities/experience.entity";
import { LinkEntity } from "src/link/entities/link.entity";
import { SkillEntity } from "src/skill/entities/skill.entity";
import { UserEntity } from "src/user/entities/user.entity";

export class CreateUserDetailDto {
  id?: number;
  user?: UserEntity;
  formation?: string;
  school?: string;
  contactEmail?: string;
  displayedOnFeed?: boolean;
  description?: string;
  address?: string;
  country?: string;
  phone?: string;
  status?: string;
  range?: number;
  skills?: SkillEntity[];
  banner?: any;
  personalPicture?: any;
  cv?: any;
  uploadFiles?: any[];
  experiences?: ExperienceEntity[];
  links?: LinkEntity[];
  cities?: CityEntity[];
}
