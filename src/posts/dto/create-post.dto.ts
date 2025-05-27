import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { is_reel } from '../enums/is_reel.status.enum';

export class CreatePostDto {
  @ApiProperty({ example: 'hello ' })
  @IsString()
  caption: string;

  @ApiProperty({ example: 'true' })
  @IsEnum(is_reel)
  is_reel: is_reel;


  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  media_url?: any;
}
