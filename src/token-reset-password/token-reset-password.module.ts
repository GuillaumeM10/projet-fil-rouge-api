import { Module } from '@nestjs/common';
import { TokenResetPasswordService } from './token-reset-password.service';
import { TokenResetPasswordController } from './token-reset-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { TokenResetPasswordEntity } from './entities/token-reset-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenResetPasswordEntity, UserEntity])
  ],
  controllers: [TokenResetPasswordController],
  providers: [TokenResetPasswordService]
})
export class TokenResetPasswordModule {}
