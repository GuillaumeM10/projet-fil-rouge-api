import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity";

export class CreateCityDto {
  name?: string;
  users?: UserDetailEntity[];
}
