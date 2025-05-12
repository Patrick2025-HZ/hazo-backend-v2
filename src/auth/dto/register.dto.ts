import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Danyal@123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Danyal Khursheed' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;
}
