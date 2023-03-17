import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { TokenResetPasswordService } from 'src/token-reset-password/token-reset-password.service';
import { CreateTokenResetPasswordDto } from 'src/token-reset-password/dto/create-token-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
    private tokenResetPasswordService: TokenResetPasswordService,
    private mailService: MailService
  ) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const user = await this.usersService.create(signupAuthDto);

    if(user.email){
      const mailToken = Math.floor(1000 + Math.random() * 9000).toString();
      await this.mailService.sendUserConfirmation(user, mailToken);
    }
    return user
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const user = await this.usersService.findOneByEmail(signinAuthDto.email);
    const password = bcrypt.compareSync(signinAuthDto.password, user.password);
    
    if(!user || !password){
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, id: user.id, role: user.role }; // informations stoked in the token
    return {
      accessToken: this.generateJwtToken(payload),
    }
  }

  generateJwtToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  async forgotPassword(
    createTokenResetPasswordDto: CreateTokenResetPasswordDto,
  ) {
    const token = await this.tokenResetPasswordService.create(
      createTokenResetPasswordDto,
    );

    this.mailService.create(createTokenResetPasswordDto, token.token);

    return `An email has been sent to ${createTokenResetPasswordDto.email}`;
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const findToken = await this.tokenResetPasswordService.findOne(token);

    if (!findToken) {
      throw new HttpException('Token not found', 400);
    }

    const user = await this.usersService.findOneByEmail(findToken.user.email);

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const updatedUser = await this.usersService.updatePassword(
      resetPasswordDto.password,
      user,
    );

    await this.tokenResetPasswordService.remove(findToken.id);
      
    return updatedUser;
  }

}
