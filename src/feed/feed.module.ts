import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Comment } from 'src/comments/entity/comments.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Like } from 'src/posts/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Post, Like])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
