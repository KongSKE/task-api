import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.discriminator';
import { Task } from './task.schema';

export enum CommentOwnership {
  Admin = 'Admin',
  Candidate = 'Candidate',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Comment {
  @Prop({
    type: String,
    enum: Object.values(CommentOwnership),
    required: true,
  })
  ownership: CommentOwnership

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  created_by: User | string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Task.name,
    required: true,
  })
  task_id: Task | string;

  @Prop({
    type: String,
    required: true,
  })
  comment_text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentToCreate = Comment;
export type CommentDocument = Comment & Document;
