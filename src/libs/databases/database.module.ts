import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.discriminator';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { Task, TaskSchema } from './schemas/task.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';

const DB_FEATURE: ModelDefinition[] = [
  {
    name: Task.name,
    schema: TaskSchema,
  },
  {
    name: Comment.name,
    schema: CommentSchema,
  },
  {
    name: User.name,
    schema: UserSchema,
    discriminators: [
      { name: Candidate.name, schema: CandidateSchema },
      { name: Admin.name, schema: AdminSchema }
    ]
  },
]

@Module({
  imports: [MongooseModule.forFeature(DB_FEATURE)],
  exports: [MongooseModule.forFeature(DB_FEATURE)],
})
export class DatabaseModule {}
