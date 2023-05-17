import { PartialType } from '@nestjs/mapped-types';
import { LinkCategoryEntity } from 'src/link-category/entities/link-category.entity';
import { UserDetailEntity } from 'src/user-detail/entities/user-detail.entity';
import { CreateLinkDto } from './create-link.dto';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  name?: string;
  url?: string;
  description?: string;
  user?: UserDetailEntity;
  linkCategory?: LinkCategoryEntity;
}
