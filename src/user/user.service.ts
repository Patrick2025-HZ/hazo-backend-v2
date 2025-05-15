import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from './entity/user.entity';
import { Repository } from 'typeorm';
import { success } from 'src/common/exception/success.exception';

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(user)
    private user: Repository<user>,
  ) {}

  async getUserDetailsById(user: any) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userDetails = await this.user.findOne({ where: { id: user.userId } });
  
    if (!userDetails) {
      throw new NotFoundException('User details not found');
    }
  
    return new success('User fetch successfully', { userDetails });
  }
  
}
