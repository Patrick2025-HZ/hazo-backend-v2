import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class updateUserDTO {
  @ApiProperty({ example: 'Danyal Khursheed', required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()

  @IsNotEmpty({ message: 'email name is required' })
  email?: string;

  @ApiProperty({ example: 'Danyal Khursheed', required: false })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName?: string;

  @ApiProperty({ example: '923498030357', required: false })
  @IsString()
  @IsNotEmpty({message:"phone number is requried"})
  phoneNumber?: string;

  @ApiProperty({ example: '2024-12-12', required: false })
  @IsString()
  @IsOptional()
  dob?: string;

  // 👇 This is the important part for file upload
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  profile?: any;
}
