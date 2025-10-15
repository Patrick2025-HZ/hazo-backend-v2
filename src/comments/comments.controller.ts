import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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
import { UUID } from 'crypto';

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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Get('comment/:postId')
  getAllComments(@Param('postId') id: string) {
    return this.commentsService.getAllComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Delete('comment/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Put('comment/:commentId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file', 10))
  updateComment(
    @Param('commentId') id: string,
    @currentUser() user: any,
    @Body() createCommentDTO: createCommentDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.commentsService.updateComment(
      id,
      user?.userId,
      createCommentDTO,
      files,
    );
  }
}
