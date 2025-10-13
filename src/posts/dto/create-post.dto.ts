import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { is_reel } from '../enums/is_reel.status.enum';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ example: 'hello ' })
  @IsString()
  caption: string;

  @ApiProperty({ example: true, type: Boolean })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  @IsBoolean()
  is_reel: boolean;

  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  file?: any[];
}
