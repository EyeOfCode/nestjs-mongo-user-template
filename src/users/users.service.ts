import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IUser } from './types/user.type';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    const salt = bcrypt.genSaltSync(saltOrRounds);

    return bcrypt.hash(password, salt);
  }

  async upload(id: string, profile: string) {
    return this.userModel.findByIdAndUpdate(new Types.ObjectId(id), {
      profile,
    });
  }

  async create(createUserDto: CreateUserDto, isApprove = false) {
    const password = await this.hashPassword(createUserDto.password);
    delete createUserDto.confirm_password;
    const payload = await this.userModel.create({
      ...createUserDto,
      password,
      isApprove,
    });
    return payload;
  }

  async findAll() {
    const user = await this.userModel.find();
    return user;
  }

  async findOnlyDeleted() {
    const user = await this.userModel.findDeleted();
    return user;
  }

  async findById(id: string | Types.ObjectId) {
    const user = await this.userModel
      .findById(new Types.ObjectId(id))
      .populate([
        {
          path: 'setting',
        },
        { path: 'profile' },
      ])
      .lean();
    if (user) {
      delete user.password;
    }
    return user;
  }

  async findOne(query: object) {
    return this.userModel.findOne(query);
  }

  async approve(id: string) {
    return this.userModel.findByIdAndUpdate(new Types.ObjectId(id), {
      isApprove: true,
    });
  }

  async restore(id: string) {
    await this.userModel.restore({ _id: new Types.ObjectId(id) });
    return this.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: IUser = {
      name: updateUserDto.name,
      password: updateUserDto.password,
    };
    if (updateUserDto.password) {
      data.password = await this.hashPassword(updateUserDto.password);
    }
    return this.userModel.findByIdAndUpdate(new Types.ObjectId(id), data);
  }

  async findDeletedById(id: string) {
    return this.findOne({ _id: new Types.ObjectId(id), isDeleted: true });
  }

  async remove(id: string) {
    await this.userModel.softDelete(new Types.ObjectId(id));
    return this.findDeletedById(id);
  }
}
