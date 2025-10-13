import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { is_reel } from './enums/is_reel.status.enum';
import { success } from 'src/common/exception/success.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    public user: Repository<User>,
    private cloudinary: CloudinaryService,

    @InjectRepository(Post)
    public post: Repository<Post>,
  ) {}
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
        this.cloudinary.uploadImage(file),
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
    });

    const feed = await this.post.find({
      where: {
        user: { id: req.user?.id },
        is_reel: false,
      },
    });

    return new success('Reels and Feeds fetch successfully', {
      feeds: feed,
      reels: reels,
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
    const postDetails = await this.post.findOne({ where: { id } });
    if (!postDetails) {
      throw new NotFoundException('No Record Found');
    }

    const feed = await this.post.find({
      where: {
        id,
      },
    });
    return new success('Reels and Feeds fetch successfully', feed[0]);
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
}
