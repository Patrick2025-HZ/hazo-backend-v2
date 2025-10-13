import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'; // make sure path is correct
import { createCommentDTO } from './dto/create-comment';
import { Comment } from './entity/comments.entity';
import { Post } from '../posts/entities/post.entity';
import { success } from 'src/common/exception/success.exception';

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
    files?: Express.Multer.File[],
  ): Promise<success> {
    const postExists = await this.posts.findOne({ where: { id: postId } });

    if (!postExists) {
      throw new NotFoundException('No Post Found');
    }
    let mediaUrls: string[] = [];

    if (files && files?.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinary.uploadFile(file),
      );
      const uploadResults = await Promise.all(uploadPromises);

      mediaUrls = uploadResults.map((result) => result.secure_url);
    }
    const createComment = await this.comments.create({
      user: { id: userId } as User,
      post: { id: postExists?.id } as Post,
      comment: dto?.comment,
      file: mediaUrls.length ? mediaUrls : null,
    });

    const comment = await this.comments.save(createComment);

    return new success('Comment added successfully', { comment });
  }
}
