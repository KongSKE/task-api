import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserType } from 'src/libs/utils/enum';

@Schema({
  discriminatorKey: 'user_type',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({
    type: String,
    enum: Object.values(UserType),
    required: true,
  })
  user_type: UserType;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  avatar_name: string;

  @Prop({
    type: {
      image_type: { type: String },
      base64_data: { type: String }, 
    },
    required: false,
    select: false,
  })
  avatar_image?: {
    image_type: string,
    base64_data: string,
  };
}

export type UserDiscriminator = Omit<User, 'user_type'>;
export const UserSchema = SchemaFactory.createForClass(User);
