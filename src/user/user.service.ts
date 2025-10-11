import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
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
    file?: Express.Multer.File,
  ) {
    // Validate UUID
    if (!isUUID(id)) {
      throw new NotFoundException('Invalid user ID format');
    }

    // Check if user exists
    const existingUser = await this.user.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User does not exist');
    }

    // Handle file upload
    let profilePicture: string | undefined;
    if (file) {
      try {
        const upload = await this.cloudinary.uploadImage(file);
        profilePicture = upload.secure_url;
      } catch (error) {
        throw new BadRequestException('Failed to upload profile picture');
      }
    }

    // Build update payload - only include provided fields
    const updatePayload: Partial<User> = {};

    // Only update fields that are provided in the DTO
    if (data.fullName !== undefined) updatePayload.fullName = data.fullName;
    if (data.userName !== undefined) updatePayload.userName = data.userName;
    if (data.dob !== undefined) updatePayload.dob = data.dob;
    if (data.phoneNumber !== undefined)
      updatePayload.phoneNumber = data.phoneNumber;

    // Add profile picture if uploaded
    if (profilePicture) {
      updatePayload.profilePicUrl = profilePicture;
    }

    // If no fields to update, return early
    if (Object.keys(updatePayload).length === 0) {
      return {
        message: 'No changes detected',
        user: existingUser,
      };
    }

    try {
      // Use update method for better performance
      await this.user.update(id, updatePayload);

      // Fetch updated user
      const updatedUser = await this.user.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'fullName',
          'userName',
          'dob',
          'profilePicUrl',
          'phoneNumber',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });

      return {
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      // Handle unique constraint violations

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async updateUserProfileV2(userId: string, data: updateUserDTO) {
    const existingUser = await this.user.findOne({ where: { id: userId } });

    if (!existingUser) {
      throw new NotFoundException('User does not exist');
    }

    Object.assign(existingUser, data);

    // Save and return updated entity
    return await this.user.save(existingUser);
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
