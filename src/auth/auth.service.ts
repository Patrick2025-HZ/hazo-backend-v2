import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pending_user } from './entity/pending_user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { otp } from './entity/otp.entity';
import { User } from 'src/user/entity/user.entity';
import { success } from 'src/common/exception/success.exception';
import { otpService } from './otp.service';
import { resetPasswordDTO } from './dto/reset_password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(pending_user)
    private pendingUser: Repository<pending_user>,
    @InjectRepository(otp)
    private otp: Repository<otp>,
    @InjectRepository(User)
    private user: Repository<User>,
    private jwtService: JwtService,
    private otpService:otpService
  ) {}

  // register
  async register(email: string, password: string, fullName: string) {
    const existingUser = await this.user.findOne({ where: { email } });
    const existingPending = await this.pendingUser.findOne({ where: { email } });


    if (existingUser || existingPending) {
      throw new ConflictException('User with this email already exists');
    } else {
      const hash = await bcrypt.hash(password, 10);
      const user = this.pendingUser.create({ email, password: hash, fullName });
      const savedUser = await this.pendingUser.save(user);
       const otp = await this.otpService.generateOTP(savedUser) 
      // const { password: _removed, ...userWithoutPassword } = user;
      throw new success(
        'User is in pending state and otp is send for verification',
        {otp:otp?.otpCode}
      );
    }
  }

  // login
  async login(email: string, password: string) {
      const user = await this.user.findOne({where:{email}});
      if(!user ){
        throw new NotFoundException("User doesnot exists")
      }
      const comparePassword = await bcrypt.compare(password, user?.password)

      if(!user || !comparePassword){
        throw new UnauthorizedException("Invalide Credentials")
      }
      const token = this.jwtService.sign({
        sub:user?.id,
        email:user?.email
      })
      const { password: _removed, ...userWithoutPassword } = user;
    

      return {
        message: "Login successfull",
        user: { ...userWithoutPassword, token },
      };
      // const decodePassword = await bcrypt.compare(password)
  }

//reset password
  async resetPassword(dto: resetPasswordDTO) {
    const userExists = await this.user.findOne({ where: { email: dto.email } });
   
  
    if (!userExists) {
      throw new NotFoundException("User does not exist with this email");
    }
  
    const isCurrentPasswordCorrect = await bcrypt.compare(dto.current_password, userExists.password);
  
    if (!isCurrentPasswordCorrect) {
      throw new BadRequestException("Incorrect current password");
    }
  
    if (dto.new_password !== dto.confirm_password) {
      throw new BadRequestException("New passwords do not match");
    }
  
    const isSameAsOld = await bcrypt.compare(dto.new_password, userExists.password);
    if (isSameAsOld) {
      throw new BadRequestException("New password must be different from the old password");
    }
  
    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(dto.new_password, 10);
    userExists.password = hashedPassword;
  
    await this.user.save(userExists);

    return {
      message: 'Password updated successfully',

    }
  }
  
}


