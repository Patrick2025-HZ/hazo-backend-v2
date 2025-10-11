import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { currentUser } from 'src/decorators/current-user.decorator';
import { createCommentDTO } from './dto/create-comment';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Post('comment/:postId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('media_url'))
  createComment(
    @Param('postId') id: string,
    @currentUser() user: any,
    @Body() createCommentDTO: createCommentDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(user, 'user id user id');
    return this.commentsService.createComment(
      id,
      user?.userId,
      createCommentDTO,
      file,
    );
  }
}
