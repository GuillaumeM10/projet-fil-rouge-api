import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTokenResetPasswordDto } from 'src/token-reset-password/dto/create-token-reset-password.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserEntity, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    try{

      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'STYDYJob : Mail de confirmation',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
          name: user.firstName,
          url,
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

      await this.mailerService.sendMail({
        to: createTokenResetPasswordDto.email,
        // from: '"Support Team" <
        subject: 'STYDYJob : Mail de changement de mot de passe',
        template: './reset-password', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
          url,
        },
      });
      
      return { message: `Mail envoyé à ${createTokenResetPasswordDto.email}`};
    
    }catch(err){
      console.log(err)
      throw new ConflictException(`Le mail n'a pas pu être envoyé à ${createTokenResetPasswordDto.email}`);
    }
  }
}