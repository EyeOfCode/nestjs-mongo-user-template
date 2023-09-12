import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from './users.command';
import { JwtUserStrategy } from '../../middleware/strategy/jwt-user.strategy';

@Module({
  imports: [
    CommandModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserCommand, JwtUserStrategy],
  exports: [UsersService],
})
export class UsersModule {}
