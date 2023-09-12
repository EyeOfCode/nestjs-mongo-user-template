import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constant/role.enum';
import { Match } from '../decorator/match.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  // match follow
  // - Passwords will contain at least 1 upper case letter
  // - Passwords will contain at least 1 lower case letter
  // - Passwords will contain at least 1 number or special character
  @ApiProperty()
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @MinLength(1)
  @MaxLength(12)
  password: string;

  @ApiProperty()
  @IsString()
  @Match('password', { message: 'password not match' })
  confirm_password: string;

  @ApiProperty()
  @IsEnum(Role, { each: true })
  @IsOptional()
  roles?: Role[];
}
