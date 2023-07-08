import { PartialType } from '@nestjs/mapped-types';
import { PostEntity } from 'src/post/entity/post.entity';
import { UserDetailEntity } from 'src/user-detail/entities/user-detail.entity';
import { CreateSkillDto } from './create-skill.dto';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
