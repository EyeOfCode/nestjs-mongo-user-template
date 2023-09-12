import { SetMetadata } from '@nestjs/common';

export const DisableWebGuard = () => SetMetadata('disableWebGuard', true);
