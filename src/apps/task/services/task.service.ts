import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskToCreate } from 'src/libs/databases/schemas/task.schema';
import { CRUDAbstractService } from 'src/libs/databases/services/crud.abstract_service';

@Injectable()
export class TaskService extends CRUDAbstractService<TaskDocument, TaskToCreate> {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>
  ) {
    super(taskModel);
  }
}
