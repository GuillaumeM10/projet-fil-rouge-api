import { LinkEntity } from "src/link/entities/link.entity"

export class CreateLinkCategoryDto {
  name?: string
  icon?: string
  links?: LinkEntity[]
}
