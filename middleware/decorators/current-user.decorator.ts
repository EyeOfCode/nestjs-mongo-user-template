import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuth } from '../strategy/jwt-user.strategy';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): UserAuth => {
    const { user } = context.switchToHttp().getRequest();
    return user;
  },
);
