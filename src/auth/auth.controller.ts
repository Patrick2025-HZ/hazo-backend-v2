import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { verifyOTP } from './dto/verify_otp.dto';
import { otpService } from './otp.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')


@Controller('auth')
export class AuthController {
  constructor(
    private authServices: AuthService,
    private otpService: otpService,
  ) {}


  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authServices.register(dto.email, dto.password, dto.fullName);
  }

  @Post('verify-otp')
  verify_otp(@Body() dto: verifyOTP) {
    return this.otpService.verifyOTP(dto.email, dto.otp);
  }

  @Post('login')
  login(@Body() dto: loginDTO) {
    return this.authServices.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get protected data' })
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiResponse({ status: 200, description: 'Successful' })
  getProfile(@Request() req) {
    return req.user;
  }
}
