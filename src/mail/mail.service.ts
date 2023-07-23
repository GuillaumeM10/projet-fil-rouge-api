import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTokenResetPasswordDto } from 'src/token-reset-password/dto/create-token-reset-password.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserEntity, token: string) {
    try{

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'STYDYJob : Mail de confirmation',
        template: './confirmation',
        context: {
          name: user.firstName
        },
      });  

    }catch(err){
      console.log(err);
      
      throw new ConflictException(`Le mail n'a pas pu être envoyé à ${user.email}`);
    } 
  }

  async create(createTokenResetPasswordDto: CreateTokenResetPasswordDto, token: string) {
    const url = `${process.env.FRONT_URL}/reset-password/${token}`;

    try{
      console.log(createTokenResetPasswordDto.email);
      
      await this.mailerService.sendMail({
        to: createTokenResetPasswordDto.email,
        subject: 'STYDYJob : Mail de changement de mot de passe',
        template: './reset-password',
        context: {
          url
        },
      });
      
    
    }catch(err){
      console.log(err)
      
      throw new ConflictException(`Le mail n'a pas pu être envoyé à ${createTokenResetPasswordDto.email}`);
    }
  }
}