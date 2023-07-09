import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDiscriminator } from './user.discriminator';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Candidate implements UserDiscriminator {
  avatar_image?: UserDiscriminator['avatar_image'];
  avatar_name: UserDiscriminator['avatar_name'];
  username: UserDiscriminator['username'];
  password: UserDiscriminator['password'];
  email: UserDiscriminator['email'];

  @Prop({
    type: {
      first: String,
      last: String,
    }
  })
  name: { first: string, last: string };
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
export type CandidateToCreate = Candidate;
export type CandidateDocument = Candidate & Document;

CandidateSchema.index({ username: 1, user_type: 1 }, { unique: true });
CandidateSchema.index({ email: 1, user_type: 1, }, { unique: true });
