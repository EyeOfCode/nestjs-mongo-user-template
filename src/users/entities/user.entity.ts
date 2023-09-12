import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

import { Role } from '../constant/role.enum';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
  toObject: { virtuals: true, getters: true },
})
export class User {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isApprove: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: [String], enum: Role, default: Role.USER })
  roles: Role[];
}

export type UserDocument = User & Document;

const UserSchema = SchemaFactory.createForClass(User).plugin(softDeletePlugin);

// UserSchema.virtual('setting', {
//   ref: 'Setting',
//   localField: '_id',
//   foreignField: 'user',
//   justOne: false,
// });

export { UserSchema };
