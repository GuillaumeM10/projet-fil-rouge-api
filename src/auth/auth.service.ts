import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto) {
    return this.usersService.create(signupAuthDto);
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const user = await this.usersService.findOneByEmail(signinAuthDto.email);
    const password = bcrypt.compareSync(signinAuthDto.password, user.password);
    
    if(!user || !password){
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, id: user.id }; // informations stoked in the token
    return {
      access_token: this.generateJwtToken(payload),
    }
  }

  generateJwtToken(payload: any) {
    return this.jwtService.sign(payload);
  }

}
