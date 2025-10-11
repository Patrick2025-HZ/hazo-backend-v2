import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class createCommentDTO {
  @ApiPropertyOptional({ example: 'Write something here' })
  @IsString()
  comment: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional media file (image/video)',
  })
  media_url?: any; // 👈 important: add a property name
}
