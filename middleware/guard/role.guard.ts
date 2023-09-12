import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../src/users/constant/role.enum';
import { UnauthorizedException } from '../../util/http-exception';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const checkRoleAdmin = requiredRoles.includes(Role.ADMIN);
    if (!checkRoleAdmin) {
      requiredRoles.push(Role.ADMIN);
    }
    const checkRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!checkRole) {
      throw new UnauthorizedException('Not permission');
    }
    return true;
  }
}
