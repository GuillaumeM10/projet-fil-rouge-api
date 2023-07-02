import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";

export class CreateCityDto {
  id?: number;
  name?: string;
  users?: UserDetailEntity[];
  posts?: any;
}
