import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtUserAuthGuard } from '../../middleware/guard/jwt-user.guard';
import { Roles } from '../../middleware/decorators/role.decorator';
import { Role } from './constant/role.enum';
import { RolesGuard } from '../../middleware/guard/role.guard';
import {
  BadRequestException,
  NotFoundException,
} from '../../util/http-exception';

@ApiSecurity('X-API-KEY')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const email = await this.usersService.findOne({
      email: createUserDto.email,
    });
    if (email) {
      throw new BadRequestException('Email Duplicate!!');
    }
    const payload: CreateUserDto = { ...createUserDto, roles: [Role.USER] };
    return this.usersService.create(payload);
  }

  @Roles(Role.USER)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Get('/deleted')
  @ApiBearerAuth()
  findOnlyDeleted() {
    return this.usersService.findOnlyDeleted();
  }

  @Roles(Role.USER)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }
    return user;
  }

  @Roles(Role.USER)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Put(':id/edit')
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Delete(':id/delete')
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (user) {
      return this.usersService.remove(id);
    }
    throw new NotFoundException('User not found');
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Patch(':id/approve')
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async approve(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }
    return this.usersService.approve(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Patch(':id/restore')
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async restore(@Param('id') id: string) {
    const user = await this.usersService.findDeletedById(id);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }
    return this.usersService.restore(id);
  }
}
