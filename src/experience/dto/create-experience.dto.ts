import { UserDetailEntity } from "src/user-detail/entities/user-detail.entity"

export class CreateExperienceDto {
  companieName?: string
  jobName?: string
  startDate?: string
  endDate?: string
  actualyIn?: boolean
  type?: string
  user?: UserDetailEntity
}
