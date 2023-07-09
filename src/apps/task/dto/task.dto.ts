import * as Joi from 'joi';
import { TaskStatus } from 'src/libs/utils/enum';

export class CreateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
  assigned_to?: string;
}

export const createTaskValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required().allow(''),
  status: Joi.string().valid(...Object.values(TaskStatus)),
  assigned_to: Joi.string().optional(),
})

export class PatchTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigned_to?: string;
}

export const patchTaskValidation = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional(),
  assigned_to: Joi.string().optional(),
})
