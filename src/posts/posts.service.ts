import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { success } from 'src/common/exception/success.exception';
import { Like } from './entities/like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    public user: Repository<User>,
    private cloudinary: CloudinaryService,

    @InjectRepository(Post)
    public post: Repository<Post>,
  ) {}

  @InjectRepository(Like)
  public like: Repository<Like>;

  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    req,
  ) {
    const userExists = await this.user.findOne({ where: { id: req.userId } });
    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    let mediaUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinary.uploadFile(file),
      );
      const uploadResults = await Promise.all(uploadPromises);

      mediaUrls = uploadResults.map((result) => result.secure_url);
    }

    const newPost = this.post.create({
      caption: createPostDto.caption,
      is_reel: createPostDto.is_reel,
      file: mediaUrls.length ? mediaUrls : null,
      user: userExists,
    });

    const post = await this.post.save(newPost);

    return new success('Post created successfully', { post });
  }

  async findAllReels(req) {
    const reels = await this.post.find({
      where: {
        user: { id: req.user?.id },
        is_reel: true,
      },
      relations: ['user', 'comments', 'like'],
    });

    const feedReel = await Promise.all(
      reels.map(async (el) => {
        const likes = await this.like.count({
          where: { post: { id: el.id } },
        });
        return {
          id: el?.id,
          user: el.user
            ? {
                id: el.user.id,
                name: el.user.fullName,
                avatar: el.user.profilePicUrl,
                email: el.user.email,
                phoneNumber: el.user.phoneNumber,
                userName: el.user.userName,
                dob: el.user.dob,
              }
            : null,
          media: el.file,
          caption: el.caption,
          isOwner: true,
          commentsCount: Array.isArray(el.comments) ? el.comments.length : 0,
          likesCount: likes,
        };
      }),
    );

    const feed = await this.post.find({
      where: {
        user: { id: req.user?.id },
        is_reel: false,
      },
      relations: ['user', 'comments', 'like'],
    });

    const feedFinal = await Promise.all(
      feed.map(async (el) => {
        const likes = await this.like.count({
          where: { post: { id: el.id } },
        });
        return {
          id: el?.id,
          user: el.user
            ? {
                id: el.user.id,
                name: el.user.fullName,
                avatar: el.user.profilePicUrl,
                email: el.user.email,
                phoneNumber: el.user.phoneNumber,
                userName: el.user.userName,
                dob: el.user.dob,
              }
            : null,
          media: el.file,
          caption: el.caption,
          isOwner: true,
          commentsCount: Array.isArray(el.comments) ? el.comments.length : 0,
          likesCount: likes,
        };
      }),
    );

    return new success('Reels and Feeds fetch successfully', {
      feeds: feedFinal,
      reels: feedReel,
    });
  }

  async update(id: string, caption: string) {
    const post = await this.post.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('No Post Found');
    }

    await this.post.update({ id }, { caption: caption });
  }

  async findOne(id: string) {
    const postDetails = await this.post.findOne({
      where: { id },
      relations: ['user', 'comments', 'like'],
    });
    const likes = await this.like.count({
      where: { post: { id: id } },
    });
    if (!postDetails) {
      throw new NotFoundException('No Record Found');
    }

    const SingleFeedData = {
      id: postDetails?.id,
      user: postDetails.user
        ? {
            id: postDetails.user.id,
            name: postDetails.user.fullName,
            avatar: postDetails.user.profilePicUrl,
            email: postDetails.user.email,
            phoneNumber: postDetails.user.phoneNumber,
            userName: postDetails.user.userName,
            dob: postDetails.user.dob,
          }
        : null,
      media: postDetails.file,
      caption: postDetails.caption,
      isOwner: true,
      commentsCount: Array.isArray(postDetails.comments)
        ? postDetails.comments.length
        : 0,
      likesCount: likes,
    };
    console.log(SingleFeedData);
    return new success('Reels and Feeds fetch successfully', SingleFeedData);
  }

  async remove(id: string) {
    const postDetails = await this.post.findOne({ where: { id } });
    if (!postDetails) {
      throw new NotFoundException('No Record Found');
    }
    await this.post.delete(id);

    return {
      message: 'Post deleted successfully',
    };
  }

  //////////////////////////////

  async LikeUnLike(userId: string, postId: string) {
    const post = await this.post.findOne({ where: { id: postId } });
    const user = await this.user.findOne({ where: { id: userId } });

    if (!user || !post) {
      throw new NotFoundException('User or Post not found');
    }
    const existingLike = await this.like.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      relations: ['user', 'post'],
    });

    if (existingLike) {
      await this.like.remove(existingLike);
      return { message: 'Post unliked successfully' };
    } else {
      await this.like.save({
        post,
        user,
      });
      return { message: 'Post liked successfully' };
    }
  }
}
