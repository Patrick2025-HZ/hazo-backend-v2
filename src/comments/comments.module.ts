import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Comment } from './entity/comments.entity';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment]), CloudinaryModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
