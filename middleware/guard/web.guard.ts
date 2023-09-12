import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '../../util/http-exception';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtWebAuthGuard
  extends AuthGuard('web-auth')
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isDisable = this.reflector.get<boolean>(
      'disableWebGuard',
      context.getHandler(),
    );
    if (isDisable) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-api-key'];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }
}
