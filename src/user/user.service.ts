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
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
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
    console.log(userDetails);

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
    }

    // Filter out empty or undefined fields
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );

    const updatedUser = {
      ...existingUser,
      ...cleanedData,
      ...(profilePicture && { profilePicUrl: profilePicture }),
    };

    await this.user.update(id, updatedUser);

    return {
      message: 'User updated successfully successfully',
    };
  }

  async deleteUser(user: any) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userDetails = await this.user.findOne({
      where: { id: user.userId },
    });
    console.log(userDetails);

    if (!userDetails) {
      throw new NotFoundException('User not found');
    }
    console.log(userDetails);

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
