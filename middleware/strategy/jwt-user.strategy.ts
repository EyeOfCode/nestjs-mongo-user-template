import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthConfig } from '../../config/auth.config';
import { Role } from '../../src/users/constant/role.enum';
import { User } from '../../src/users/entities/user.entity';
import { UsersService } from '../../src/users/users.service';

export interface UserAuth {
  role: Role[];
  sub: string;
  v: string;
}

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<AuthConfig>('auth')?.JWT_SECRET_KEY,
    });
  }

  async validate(payload: UserAuth): Promise<User> {
    try {
      const user = await this.usersService.findById(payload.sub);
      if (!user.isApprove) {
        return null;
      }
      return { ...user };
    } catch (err) {
      return null;
    }
  }
}
