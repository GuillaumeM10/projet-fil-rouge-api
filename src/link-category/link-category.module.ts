import { Module } from '@nestjs/common';
import { LinkCategoryService } from './link-category.service';
import { LinkCategoryController } from './link-category.controller';

@Module({
  controllers: [LinkCategoryController],
  providers: [LinkCategoryService]
})
export class LinkCategoryModule {}
