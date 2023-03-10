import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
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


  // forgotPassword: async (req, res) => {
  //   const { email } = req.body;
  //   try {
  //     const user = await User.findOne({ email: email });
      
  //     if (!user) {
  //       return res.status(404).send({ message: "User not found" });
  //     }

  //     const resetPassword = await TokenResetPassword.findOne({ user: user._id });

  //     let uuidToken
  //     if (!resetPassword) {
  //       uuidToken = new TokenGenerator(256, TokenGenerator.BASE62).generate();
        
  //       console.log(uuidToken);
  //       TokenResetPassword.create({ user: user._id, token: uuidToken });
  //     } else {
  //       uuidToken = resetPassword.token;
  //     }

  //     const mailOptions = {
  //       from: "ui@esd.com",
  //       to: email,
  //       subject: "Reset password link",
  //       html: `<a href="http://localhost:3000/reset-password/${uuidToken}">Reset password</a>`,
  //     };

  //     transporter.sendMail(mailOptions, function (error, info) {

  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log("Email sent: " + info.response);
  //       }

  //     });

  //     res.send({ message: "Reset password link sent to your email" });
  //   } catch (error) {
  //     res.status(500).send({ error: error.message });
  //   }
  // },
  // resetPassword: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { password } = req.body;
  //     console.log("id", id);
  //     console.log("password", password);
    
  //     const findResetPassword = await TokenResetPassword.findOne({ token: id });
  //     console.log("findResetPassword", findResetPassword);  
    
  //     if (!findResetPassword) {
  //       return response
  //         .status(404)
  //         .send({ message: "Reset password link not found" });
  //     }

  //     const userId = findResetPassword.user;
  //     const user = User.findOne({ id: userId });

  //     if (!user) {
  //       return res.status(404).send({ message: "User not found" });
  //     }

  //     const hashedPassword = await bcrypt.hash(password, salt);
  //     console.log("hashedPassword", hashedPassword);

  //     const updateUser = await User.findByIdAndUpdate(userId, {
  //       password: hashedPassword,
  //     });

  //     await updateUser.save();
  //     await TokenResetPassword.findByIdAndDelete(findResetPassword._id);

  //     res.send(updateUser);
  //   } catch (error) {
  //     res.status(500).send({ error: error.message });
  //   }
  // }


}
