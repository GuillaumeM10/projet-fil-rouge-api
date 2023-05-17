import { PartialType } from '@nestjs/mapped-types';
import { UserDetailEntity } from 'src/user-detail/entities/user-detail.entity';
import { CreateCityDto } from './create-city.dto';

export class UpdateCityDto extends PartialType(CreateCityDto) {
  name?: string;
  users?: UserDetailEntity[];
}
