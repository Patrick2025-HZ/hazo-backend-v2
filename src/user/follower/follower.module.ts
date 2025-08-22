import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { FollowerEntity } from './entity/follower.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FollowerEntity]) 
  ],
  providers: [FollowerService],
  controllers: [FollowerController]
})
export class FollowerModule {}
