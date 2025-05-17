import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Put('updateUser/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profile'))
  updatedProfile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: updateUserDTO,
  ) {
    return this.userServices.updateUserProfile(id, updateUserDto, file);
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Delete('delete')
  async deleteUser (@Req() req:any){
    return this.userServices.deleteUser(req.user)
  }
}
