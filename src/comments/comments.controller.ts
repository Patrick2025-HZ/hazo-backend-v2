import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { currentUser } from 'src/decorators/current-user.decorator';
import { createCommentDTO } from './dto/create-comment';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Post('comment/:postId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file', 10))
  createComment(
    @Param('postId') id: string,
    @currentUser() user: any,
    @Body() createCommentDTO: createCommentDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.commentsService.createComment(
      id,
      user?.userId,
      createCommentDTO,
      files,
    );
  }
}
