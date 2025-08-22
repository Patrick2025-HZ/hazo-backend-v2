import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowerEntity } from './entity/follower.entity';
import { success } from 'src/common/exception/success.exception';

@Injectable()
export class FollowerService {
  constructor(
    @InjectRepository(User)
    private User: Repository<User>,

    @InjectRepository(FollowerEntity)
    private follower: Repository<FollowerEntity>,
  ) {}
  async toggleFollow(user, followerId) {
    if (!followerId) {
      throw new BadRequestException('Follower id is requried');
    }

    if (!user) {
      throw new BadRequestException('UserId is requried');
    }

    const userDetails = await this.User.findOne({ where: { id: user.userId } });
    const followerDetails = await this.User.findOne({
      where: { id: followerId },
    });

    if (userDetails === followerId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existingFollow = await this.follower.findOne({
      where: {
        follower: { id: followerId },
        followedUser: { id: userDetails?.id },
      },
    });

    if (existingFollow) {
      await this.follower.delete({
        follower: { id: followerId },
        followedUser: { id: userDetails?.id },
      });
      return {
        status: true,
        message: 'UnFollowed Successfully',
      };
    }
    const newFollow = this.follower.create({
      follower: { id: followerId },
      followedUser: { id: userDetails?.id },
    });

    await this.follower.save(newFollow);
    return {
      status: true,
      message: 'Followed Successfully',
    };
  }

  async getAllFollowers(user) {
    const userDetails = await this.User.findOne({ where: { id: user.userId } });
    if (!userDetails) {
      throw new NotFoundException('user does not exists');
    }
    const following = await this.follower.find({
      where: { followedUser: { id: userDetails?.id } },
      relations: ['follower'],
    });

    return {
      status: true,
      message: 'Successfully fetch all the following',
      following,
    };
  }

  async getAllFollowing(user) {
    const userDetails = await this.User.findOne({ where: { id: user.userId } });
    if (!userDetails) {
      throw new NotFoundException('user does not exists');
    }
    const following = await this.follower.find({
      where: { follower: { id: userDetails?.id } },
      relations: ['followedUser'],
    });

    return {
      status: true,
      message: 'Successfully fetch all the followers',
      following,
    };
  }

  async followerAndFollowingCount(user) {
    const userDetails = await this.User.findOne({ where: { id: user.userId } });
    if (!userDetails) {
      throw new NotFoundException('user does not exists');
    }

    const followerCount = await this.follower.count({
      where: { followedUser: { id: userDetails?.id } },
    });

    const followingCount = await this.follower.count({
      where: { follower: { id: userDetails?.id } },
    });

    return {
      status: true,
      message: 'Successfully fetch all the followers',
      data:{followers: followerCount,
        following: followingCount,}
      
    };
  }
}
