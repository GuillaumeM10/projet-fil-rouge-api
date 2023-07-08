import { PartialType } from '@nestjs/mapped-types';
import { UserDetailEntity } from 'src/user-detail/entities/user-detail.entity';
import { CreateExperienceDto } from './create-experience.dto';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}