import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { pending_user } from './entity/pending_user.entity';
import { otp } from './entity/otp.entity';
import { user } from 'src/user/entity/user.entity';
import { otpService } from './otp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([pending_user, otp, user]),
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, otpService],
  controllers: [AuthController]
})
export class AuthModule {}
