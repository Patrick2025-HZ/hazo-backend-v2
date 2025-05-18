import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenBlocklistService } from './tokenBlockList.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokenBlocklistService: TokenBlocklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = req.headers['authorization']?.split(' ')[1];

    const isBlocked = await this.tokenBlocklistService.isTokenBlocked(token);

    if (isBlocked) {
      throw new UnauthorizedException('Token has been blocked');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
