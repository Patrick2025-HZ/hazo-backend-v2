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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateUserDTO } from 'src/user/dto/user.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Post('create-post')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('media_url'))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req:any
  ) {

    return this.postsService.create(createPostDto, file, req.user);
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')

  @Post('update-post/:id')
  update(
    @Param('id') id:string,
    @Body() body:UpdatePostDto
  ){
    return this.postsService.update(id, body.caption)
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Get('get-all-reels-and-posts')
  getAllReels(
   
    @Req() req:any
  ) {

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
