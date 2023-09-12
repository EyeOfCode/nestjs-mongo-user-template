import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthConfig } from '../../config/auth.config';
import { WhiteList } from 'util/web-whitelist';

export interface IAuth {
  sub: string;
  v: string;
}

@Injectable()
export class JwtWebStrategy extends PassportStrategy(Strategy, 'web-auth') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-api-key'),
      ignoreExpiration: true,
      secretOrKey: configService.get<AuthConfig>('auth')?.JWT_SECRET_WEB_KEY,
    });
  }

  async validate(payload: IAuth) {
    try {
      if (!WhiteList.includes(payload.sub)) {
        return null;
      }
      return true;
    } catch (err) {
      return null;
    }
  }
}
