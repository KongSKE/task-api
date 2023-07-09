import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDiscriminator } from './user.discriminator';
import { Document } from 'mongoose';

@Schema()
export class Admin implements UserDiscriminator {
  avatar_image?: UserDiscriminator['avatar_image'];
  avatar_name: UserDiscriminator['avatar_name'];
  username: UserDiscriminator['username'];
  password: UserDiscriminator['password'];
  email: UserDiscriminator['email'];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
export type AdminToCreate = Admin
export type AdminDocument = Admin & Document;

AdminSchema.index({ username: 1 }, { unique: true });
AdminSchema.index({ email: 1 }, { unique: true });