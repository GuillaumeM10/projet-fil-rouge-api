import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenResetPasswordDto } from './create-token-reset-password.dto';

export class UpdateTokenResetPasswordDto extends PartialType(CreateTokenResetPasswordDto) {}
