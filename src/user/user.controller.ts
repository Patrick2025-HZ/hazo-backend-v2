import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserServices } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { currentUser } from 'src/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateUserDTO } from './dto/user.dto';
import { request } from 'http';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userServices: UserServices) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Get('currentUser')
  getUserDetailsById(@currentUser() user: any) {
    return this.userServices.getUserDetailsById(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth('access-token')
  @Post('updateUser')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profile'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: { type: 'string', example: 'Danyal Khursheed' },
        email: { type: 'string', example: 'john@example.com' },
        fullName: { type: 'string', example: 'Danyal Khursheed' },
        phoneNumber: { type: 'string', example: '923498030357' },
        dob: { type: 'string', example: '2024-12-12' },
        profile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updatedProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: updateUserDTO,
    @currentUser() user: any,
  ) {
    return this.userServices.updateUserProfile(
      user?.userId,
      updateUserDto,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile (JSON only)' })
  @ApiBearerAuth('access-token')
  @Post('updateUserv2')
  @ApiConsumes('application/json') // 👈 pure JSON
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: { type: 'string', example: 'Danyal Khursheed' },
        email: { type: 'string', example: 'john@example.com' },
        fullName: { type: 'string', example: 'Danyal Khursheed' },
        phoneNumber: { type: 'string', example: '923498030357' },
        dob: { type: 'string', example: '2024-12-12' },
      },
    },
  })
  async updateUserV2(
    @Body() updateUserDTO: updateUserDTO,
    @currentUser() user: any,
  ) {
    return this.userServices.updateUserProfileV2(user?.userId, updateUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Delete('delete')
  async deleteUser(@Req() req: any) {
    return this.userServices.deleteUser(req.user);
  }
}
