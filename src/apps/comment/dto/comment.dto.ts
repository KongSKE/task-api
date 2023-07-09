import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateCommentDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  task_id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  comment_text: string;
}

export const createCommentValidation = Joi.object({
  task_id: Joi.string().required(),
  comment_text: Joi.string().required(),
});
