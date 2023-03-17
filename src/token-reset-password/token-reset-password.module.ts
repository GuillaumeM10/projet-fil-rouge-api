import { Module } from '@nestjs/common';
import { TokenResetPasswordService } from './token-reset-password.service';
import { TokenResetPasswordController } from './token-reset-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { TokenResetPasswordEntity } from './entities/token-reset-password.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenResetPasswordEntity, UserEntity]),
    UserModule
  ],
  controllers: [TokenResetPasswordController],
  providers: [TokenResetPasswordService]
})
export class TokenResetPasswordModule {}
