import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class resetPasswordDTO {

      @ApiProperty({ example: 'john@example.com' })
      @IsEmail()
      email: string;


      @ApiProperty({ example: 'Danyal@123' })
      @IsString()
      @MinLength(6)
      current_password: string;

      @ApiProperty({ example: 'Danyal@123' })
      @IsString()
      @MinLength(6)
      new_password: string;

      @ApiProperty({ example: 'Danyal@123' })
      @IsString()
      @MinLength(6)
      confirm_password: string;
}