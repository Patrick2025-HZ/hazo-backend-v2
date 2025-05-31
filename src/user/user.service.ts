import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { success } from 'src/common/exception/success.exception';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { updateUserDTO } from './dto/user.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
    private cloudinary: CloudinaryService,
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
  async updateUserProfile(
    id: string,
    data: updateUserDTO,
    file: Express.Multer.File,
  ) {
    if (!isUUID(id)) {
      throw new NotFoundException('User does not exist');
    }
  
    const existingUser = await this.user.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User does not exist');
    }
  
    let profilePicture: string | undefined;
    if (file) {
      const upload = await this.cloudinary.uploadImage(file);
      profilePicture = upload.secure_url;
      console.log('Cloudinary URL:', profilePicture);
    }
  
    const updatePayload = {
      ...data,
      ...(profilePicture ? { profilePicUrl: profilePicture } : {}),
    };
    console.log('Update payload:', updatePayload);
  
    const result = await this.user.update(id, updatePayload);
    console.log('Update result:', result);
  
    // Fetch the updated user to verify
    const updatedUser = await this.user.findOne({ where: { id } });
    console.log('Updated user:', updatedUser);
  
    return {
      message: 'User updated successfully',
      user :updatedUser
    };
  }

  async deleteUser(user: any) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userDetails = await this.user.findOne({
      where: { id: user.userId },
    });

    if (!userDetails) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = {
      ...userDetails,
      isDeleted: true,
      deletedAt: new Date(),
    };
    await this.user.save(userDetails);

    return {
      message: 'User soft deleted successfully',
    };
  }
}
