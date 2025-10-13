import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class createCommentDTO {
  @ApiPropertyOptional({ example: 'Write something here' })
  @IsString()
  comment: string;

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
