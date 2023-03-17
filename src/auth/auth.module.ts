import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { TokenResetPasswordEntity } from 'src/token-reset-password/entities/token-reset-password.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { TokenResetPasswordService } from 'src/token-reset-password/token-reset-password.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '86400s' },
    }),
    MailModule,
    TypeOrmModule.forFeature([UserEntity, TokenResetPasswordEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenResetPasswordService, MailService],
  // exports: [AuthService]
})
export class AuthModule {}
