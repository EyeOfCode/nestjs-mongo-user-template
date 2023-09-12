import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '../users/constant/role.enum';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UsersService) {}
  //Ex npm run cmd:user:generate create:user admin@admin.com admin -- -u admin -r admin
  @Command({
    command: 'create:user <email> <password>',
    describe: 'create a user',
  })
  async create(
    @Positional({
      name: 'password',
      describe: 'password',
      type: 'string',
    })
    password: string,
    @Positional({
      name: 'email',
      describe: 'email',
      type: 'string',
    })
    email: string,
    @Option({
      name: 'role',
      describe: 'user role (ex: "user" or "admin") def user',
      type: 'string',
      alias: 'r',
      default: Role.USER,
      required: true,
    })
    role: Role,
    @Option({
      name: 'username',
      describe: 'username',
      type: 'string',
      alias: 'u',
      default: '',
      required: true,
    })
    username: string,
  ) {
    const user = await this.userService.create(
      {
        name: username,
        email,
        password,
        roles: [role],
        confirm_password: password,
      },
      role === Role.ADMIN,
    );
    console.log('new user', user);
  }
}
