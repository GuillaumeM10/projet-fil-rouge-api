import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { CreateTokenResetPasswordDto } from './dto/create-token-reset-password.dto';
import { TokenResetPasswordEntity } from './entities/token-reset-password.entity';

@Injectable()
export class TokenResetPasswordService {
  constructor(
    @InjectRepository(TokenResetPasswordEntity)
    private readonly tokenResetPasswordRepository: TokenResetPasswordEntity,
    private usersService: UserService,
  ) {}

  async create(createTokenResetPasswordDto: CreateTokenResetPasswordDto) {
    const findUser = await this.usersService.findOneByEmail(
      createTokenResetPasswordDto.email,
    );

    if (!findUser) {
      throw new HttpException('User not found', 400);
    }

    const findToken = await this.findOneByEmail(
      createTokenResetPasswordDto.email,
    );

    if (findToken) {
      return findToken;
    }

    const token = uuidv4();

    const newToken = await this.tokenResetPasswordRepository.create({
      token,
      user: findUser,
    });
    return this.tokenResetPasswordRepository.save(newToken);
  }

  async findOneByEmail(email: string) {
    const findUser = await this.usersService.findOne(email);

    if (!findUser) {
      throw new HttpException('User not found', 400);
    }

    const token = await this.tokenResetPasswordRepository
      .createQueryBuilder('resetPasswordToken')
      .leftJoinAndSelect('resetPasswordToken.user', 'user')
      .where('user.email = :email', { email })
      .getOne();

    return token;
  }

  async findOne(token: string) {
    const findToken = await this.tokenResetPasswordRepository
      .createQueryBuilder('resetPasswordToken')
      .leftJoinAndSelect('resetPasswordToken.user', 'user')
      .where('resetPasswordToken.token = :token', { token })
      .getOne();
    return findToken;
  }

  remove(id: number) {
    return this.tokenResetPasswordRepository.delete(id);
  }
}
