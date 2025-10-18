import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entity/comments.entity';
import { Like } from 'src/posts/entities/like.entity';
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

    @InjectRepository(Like)
    public like: Repository<Like>,
  ) {}

  async getAllFeed(userId: string) {
    const posts = await this.post.find({
      order: { createdAt: 'DESC' },
      relations: ['user', 'comments'],
    });

    const postsData = await Promise.all(
      posts.map(async (post) => {
        const likes = await this.like.count({
          where: { post: { id: post.id } },
        });

        return {
          id: post.id,
          user: post.user
            ? {
                id: post.user.id,
                name: post.user.fullName,
                avatar: post.user.profilePicUrl,
                email: post.user.email,
                phoneNumber: post.user.phoneNumber,
                userName: post.user.userName,
                dob: post.user.dob,
              }
            : null,
          media: post.file,
          caption: post.caption,
          isOwner: post.user?.id === userId,
          commentsCount: Array.isArray(post.comments)
            ? post.comments.length
            : 0,
          likesCount: likes,
        };
      }),
    );

    return postsData;
  }
}
