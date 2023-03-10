import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDetailModule } from 'src/user-detail/user-detail.module';
import { TokenResetServiceEntity } from './entities/token-reset-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenResetServiceEntity]),
    UserDetailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
