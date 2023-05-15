import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkEntity } from './entities/link.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkEntity]),
  ],
  controllers: [LinkController],
  providers: [LinkService]
})
export class LinkModule {}
