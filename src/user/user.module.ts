import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserServices } from './user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FollowerModule } from './follower/follower.module';
import { FollowerEntity } from './follower/entity/follower.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FollowerEntity]),
    CloudinaryModule,
    FollowerModule,
  ],
  providers: [UserServices],
  controllers: [UserController],
})
export class UserModule {}
