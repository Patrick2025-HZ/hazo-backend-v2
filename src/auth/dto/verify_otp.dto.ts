import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class verifyOTP {
  @ApiProperty({ example: 'danyalkhursheed9@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  otp: string;
}
