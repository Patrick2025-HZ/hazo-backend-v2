import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'hello ' })
  @IsString()
  caption: string;}