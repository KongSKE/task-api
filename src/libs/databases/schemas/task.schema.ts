import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Admin } from "./admin.schema";
import { TaskStatus } from "src/libs/utils/enum";
import { Candidate } from "./candidate.schema";

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Task {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    required: true,
  })
  status: TaskStatus;
  
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Admin.name,
    required: true,
  })
  created_by: string | Admin;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Candidate.name,
    required: false,
  })
  assigned_to?: string | Candidate;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  is_archived?: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Admin.name,
    required: false,
  })
  archived_by?: string | Admin;

  @Prop({
    type: Date,
    required: false,
  })
  archived_date?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export type TaskToCreate = Task;
export type TaskDocument = Task & Document;
