import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkCategoryDto } from './create-link-category.dto';

export class UpdateLinkCategoryDto extends PartialType(CreateLinkCategoryDto) {}
