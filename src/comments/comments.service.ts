import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'; // make sure path is correct
import { createCommentDTO } from './dto/create-comment';
import { Comment } from './entity/comments.entity';
import { Post } from '../posts/entities/post.entity';
import { success } from 'src/common/exception/success.exception';
import { UUID } from 'crypto';

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
    const postExists = await this.posts.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!postExists) {
      throw new NotFoundException('No Post Found');
    }

    let parentComment: Comment | null = null;
    if (dto.parentCommentId) {
      parentComment = await this.comments.findOne({
        where: { id: dto.parentCommentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    let mediaUrls: string[] = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinary.uploadFile(file),
      );
      const uploadResults = await Promise.all(uploadPromises);
      mediaUrls = uploadResults.map((r) => r.secure_url);
    }

    const newComment = this.comments.create({
      user: { id: userId } as User,
      post: { id: postExists.id } as Post,
      comment: dto.comment,
      file: mediaUrls.length ? mediaUrls : null,
      parentComment: parentComment
        ? ({ id: parentComment.id } as Comment)
        : null,
    });

    const savedComment = await this.comments.save(newComment);

    const populatedComment = await this.comments.findOne({
      where: { id: savedComment.id },
      relations: ['user', 'post', 'parentComment'],
    });

    if (!populatedComment) {
      throw new NotFoundException('Comment not found after saving');
    }

    const commentObject = {
      id: populatedComment.id,
      comment: populatedComment.comment,
      createdAt: populatedComment.createdAt,
      file: populatedComment.file,
      isLiked: populatedComment.isLiked,
      user: populatedComment.user
        ? {
            id: populatedComment.user.id,
            email: populatedComment.user.email,
            fullName: populatedComment.user.fullName,
            userName: populatedComment.user.userName,
            profilePicUrl: populatedComment.user.profilePicUrl,
          }
        : null,
    };

    return new success('Comment added successfully', commentObject);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async getAllComments(postId: string) {
    const postExists = await this.posts.findOne({ where: { id: postId } });

    if (!postExists) {
      throw new NotFoundException('No Post Found');
    }

    const comments = await this.comments.find({
      where: { post: { id: postId } },
      relations: ['user', 'parentComment'],
      order: { createdAt: 'ASC' },
    });

    const commentMap = new Map<string, any>();

    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        id: comment.id,
        comment: comment.comment,
        createdAt: comment.createdAt,
        file: comment.file,
        isLiked: comment.isLiked,
        user: comment.user
          ? {
              id: comment.user.id,
              email: comment.user.email,
              fullName: comment.user.fullName,
              userName: comment.user.userName,
              profilePicUrl: comment.user.profilePicUrl,
            }
          : null,
        children: [] as any[],
      });
    });
    const rootComments: any[] = [];

    comments.forEach((comment) => {
      const mappedComment = commentMap.get(comment.id);
      if (comment.parentComment) {
        const parent = commentMap.get(comment.parentComment.id);
        if (parent) {
          parent.children.push(mappedComment);
        }
      } else {
        rootComments.push(mappedComment);
      }
    });

    return rootComments;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async deleteComment(commentId: string) {
    console.log(commentId, 'commentId commentId');
    const comment = await this.comments.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('No Comment Found');
    }

    await this.comments.delete(commentId);

    return {
      success: true,
      message: 'Comment deleted successfully',
      deletedCommentId: commentId,
    };
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async updateComment(
    commentId: string,
    userId: string,
    dto: createCommentDTO,
    files?: Express.Multer.File[],
  ): Promise<success> {
    // Step 1: Find existing comment
    const existingComment = await this.comments.findOne({
      where: { id: commentId },
      relations: ['user', 'post', 'parentComment'],
    });

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    // Optional: Only allow the user who created it to update
    if (existingComment.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }

    // Step 2: Handle optional parent comment
    let parentComment: Comment | null = null;
    if (dto.parentCommentId) {
      parentComment = await this.comments.findOne({
        where: { id: dto.parentCommentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    // Step 3: Upload new files if any
    let mediaUrls: string[] = existingComment.file || [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinary.uploadFile(file),
      );
      const uploadResults = await Promise.all(uploadPromises);
      mediaUrls = uploadResults.map((r) => r.secure_url);
    }

    // Step 4: Update fields conditionally
    existingComment.comment = dto.comment ?? existingComment.comment;
    existingComment.file = mediaUrls.length ? mediaUrls : existingComment.file;
    existingComment.parentComment =
      parentComment || existingComment.parentComment;

    // Step 5: Save updated comment
    const updatedComment = await this.comments.save(existingComment);

    // Step 6: Return response
    const commentObject = {
      id: updatedComment.id,
      comment: updatedComment.comment,
      createdAt: updatedComment.createdAt,
      file: updatedComment.file,
      isLiked: updatedComment.isLiked,
      user: updatedComment.user
        ? {
            id: updatedComment.user.id,
            email: updatedComment.user.email,
            fullName: updatedComment.user.fullName,
            userName: updatedComment.user.userName,
            profilePicUrl: updatedComment.user.profilePicUrl,
          }
        : null,
    };

    return new success('Comment updated successfully', commentObject);
  }
}
