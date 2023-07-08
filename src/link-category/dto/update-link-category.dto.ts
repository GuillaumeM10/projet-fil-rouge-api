import { PartialType } from '@nestjs/mapped-types';
import { LinkEntity } from 'src/link/entities/link.entity';
import { CreateLinkCategoryDto } from './create-link-category.dto';

export class UpdateLinkCategoryDto extends PartialType(CreateLinkCategoryDto) {}
