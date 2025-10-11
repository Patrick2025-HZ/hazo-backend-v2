import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'; // make sure path is correct
import { createCommentDTO } from './dto/create-comment';
import { Comment } from './entity/comments.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(User)
    public user: Repository<User>,

    @InjectRepository(Post)
    public posts: Repository<Post>,

    @InjectRepository(Comment)
    public comments: Repository<Comment>,

    private readonly cloudinary: CloudinaryService,
  ) {}

  async createComment(
    postId: string,
    userId: string,
    dto: createCommentDTO,
    file?: Express.Multer.File,
  ): Promise<void> {
    const postExists = await this.posts.findOne({ where: { id: postId } });

    if (!postExists) {
      throw new NotFoundException('No Post Found');
    }

    if (file) {
      const upload = await this.cloudinary.uploadImage(file);
      const commentPicture = upload.secure_url;
      const createComment = await this.comments.create({
        user: { id: userId } as User,
        post: { id: postExists?.id } as Post,
        comment: dto?.comment,
        // file: file,
      });
    } else {
      return;
    }
  }
}
