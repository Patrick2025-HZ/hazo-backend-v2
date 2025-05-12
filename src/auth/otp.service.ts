import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { otp } from './entity/otp.entity';
import { Repository } from 'typeorm';
import { pending_user } from './entity/pending_user.entity';
import { success } from 'src/common/exception/success.exception';
import { user } from 'src/user/entity/user.entity';

@Injectable()
export class otpService {
  constructor(
    @InjectRepository(otp)
    public otp: Repository<otp>,

    @InjectRepository(pending_user)
    public pendingUser: Repository<pending_user>,

    @InjectRepository(user)
    public user:Repository<user>
  ) {}


  async generateOTP(pending_user: pending_user) {
    const otp = Math.floor(10000 + Math.random() * 90000);
    const expirationTime = new Date(Date.now() + 10 * 60000); 

    const otpRecord = await this.otp.create({
        otpCode:otp.toString(),
        expiresAt:expirationTime,
        pendingUserId: pending_user

    })
    await this.otp.save(otpRecord);
    return otpRecord;
  }

  async verifyOTP(email: string, otp: string): Promise<string> {
    const userExists = await this.pendingUser.findOne({ where: { email } });
  
    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }
  
    const otpDetails = await this.otp.findOne({
      where: { pendingUserId: { id: userExists.id } },
      relations: ['pendingUserId'],
    });
  
    if (!otpDetails) {
      throw new NotFoundException('OTP record not found');
    }
  
    if (otpDetails.expired === true) {
      throw new UnauthorizedException('OTP has expired');
    }
  
    if (otp !== otpDetails.otpCode) {
      throw new UnauthorizedException('Invalid OTP');
    }
  
    const newUser = await this.user.create({
      email:userExists?.email,
      password:userExists.password,
      fullName:userExists.fullName
    })
    await this.user.save(newUser);

    await this.pendingUser.delete({ email });

    await this.otp.delete({ id: otpDetails.id });
  
    throw new success("OTP verified successfully", newUser)

  }
  
}
