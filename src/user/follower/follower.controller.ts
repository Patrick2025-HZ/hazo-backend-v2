import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { currentUser } from 'src/decorators/current-user.decorator';
import { FollowerService } from './follower.service';

@Controller('follower')
export class FollowerController {
    constructor(
        private followerService :FollowerService
    ){}

      @UseGuards(JwtAuthGuard)
      @ApiOperation({ summary: 'Get protected data' })
      @ApiBearerAuth('access-token')
      @Post('follow/:followerId')
      follow(@currentUser() user,
        @Param("followerId") followerId:string
    ){
     
        return this.followerService.toggleFollow(user, followerId)
      }

      @UseGuards(JwtAuthGuard)
      @ApiOperation({ summary: 'Get protected data' })
      @ApiBearerAuth('access-token')
      @Get('get-all-followers')
      getAllFollowing(@currentUser() user,
       
    ){
     
        return this.followerService.getAllFollowing(user)
      }

      @UseGuards(JwtAuthGuard)
      @ApiOperation({ summary: 'Get protected data' })
      @ApiBearerAuth('access-token')
      @Get('get-all-following')
      getAllFollowers(@currentUser() user,
       
    ){
     
        return this.followerService.getAllFollowers(user)
      }

      @UseGuards(JwtAuthGuard)
      @ApiOperation({ summary: 'Get protected data' })
      @ApiBearerAuth('access-token')
      @Get('follower-and-following-count')
      followerAndFollowingCount(@currentUser() user,){
        return this.followerService.followerAndFollowingCount(user)
      }
}
