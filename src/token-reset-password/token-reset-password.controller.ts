import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateTokenResetPasswordDto } from './dto/create-token-reset-password.dto';
import { TokenResetPasswordService } from './token-reset-password.service';

@Controller('token-reset-password')
export class TokenResetPasswordController {
  constructor(private readonly tokenResetPasswordService: TokenResetPasswordService) {}

  @Post()
  create(@Body() createTokenResetPasswordDto: CreateTokenResetPasswordDto) {
    return this.tokenResetPasswordService.create(createTokenResetPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenResetPasswordService.remove(+id);
  }
}
