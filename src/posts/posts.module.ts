import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { User } from 'src/user/entity/user.entity';
import { Post } from './entities/post.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([User, Post]),
      CloudinaryModule
    ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
