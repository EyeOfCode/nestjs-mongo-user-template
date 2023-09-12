import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtWebStrategy } from 'middleware/strategy/web.strategy';
import { APP_GUARD } from '@nestjs/core';

import AppConfig from '../config/app.config';
import DatabaseConfig from '../config/database.config';
import ThrottlerConfig from '../config/throttler.config';
import AuthConfig from '../config/auth.config';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig, DatabaseConfig, ThrottlerConfig, AuthConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          ...config.get('db'),
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttler.THROTTLE_TTL'),
          limit: config.get('throttler.THROTTLE_LIMIT'),
        },
      ],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [
    JwtWebStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
