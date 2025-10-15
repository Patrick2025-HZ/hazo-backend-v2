import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class createCommentDTO {
  @ApiPropertyOptional({ example: 'Write something here' })
  @IsString()
  comment: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '' })
  parentCommentId?: UUID;

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
