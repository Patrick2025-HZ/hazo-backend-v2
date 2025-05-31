import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { pending_user } from './entity/pending_user.entity';
import { otp } from './entity/otp.entity';
import { User } from 'src/user/entity/user.entity';
import { otpService } from './otp.service';
import { TokenBlocklistService } from './tokenBlockList.service';
import { blockListTokenEntity } from './entity/blocklist.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([pending_user, otp, User, blockListTokenEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: 'your_jwt_secret', 
          signOptions: {
            expiresIn: '1d', 
          },
        };
      },
    }),
  ],



  
  providers: [AuthService, JwtStrategy, otpService, TokenBlocklistService],
  controllers: [AuthController],
})
export class AuthModule {}
