import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create post with multiple files' })
  @ApiBearerAuth('access-token')
  @Post('create-post')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file', 10))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    return this.postsService.create(createPostDto, files, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Post('update-post/:id')
  update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postsService.update(id, body.caption);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Get('get-all-reels-and-posts')
  getAllReels(@Req() req: any) {
    return this.postsService.findAllReels(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Get('get-single-post/:id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
