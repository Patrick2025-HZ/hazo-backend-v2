import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class updateUserDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userName?: string;


  @IsEmail()

  @IsNotEmpty({ message: 'email name is required' })
  email?: string;


  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName?: string;


  @IsString()
  @IsNotEmpty({message:"phone number is requried"})
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  dob?: string;

  // 👇 This is the important part for file upload
  // @IsOptional()
  // @ApiProperty({
  //   type: 'string',
  //   format: 'binary',
  //   required: false,
  // })
  // profile?: any;
}
