import { Module } from '@nestjs/common';
import { LinkCategoryService } from './link-category.service';
import { LinkCategoryController } from './link-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkCategoryEntity } from './entities/link-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkCategoryEntity])
  ],
  controllers: [LinkCategoryController],
  providers: [LinkCategoryService]
})
export class LinkCategoryModule {}
