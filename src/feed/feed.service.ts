import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entity/comments.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(User)
    public user: Repository<User>,

    @InjectRepository(Post)
    public post: Repository<Post>,

    @InjectRepository(Comment)
    public comments: Repository<Comment>,
  ) {}

  async getAllFeed(id: string) {
    const posts = await this.post.find({
      order: { createdAt: 'DESC' },
      relations: ['user', 'comments'],
    });

    const feedWithCommentsCount = posts.map((post) => ({
      ...post,
      commentsCount: Array.isArray(post.comments) ? post.comments.length : 0,
    }));

    return feedWithCommentsCount;
  }
}
