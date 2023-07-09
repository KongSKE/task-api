import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";

export class PatchCandidateDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  avatar_name?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  email?: string;

  @ApiProperty({
    type: {
      first: { type: String },
      last: { type: String },
    },
    required: false,
  })
  name?: { first: string, last: string };

  @ApiProperty({
    type: {
      image_type: { type: String },
      base64_data: { type: String },
    },
    required: false,
  })
  avatar_image?: {
    image_type: string,
    base64_data: string,
  }
}

export const patchCandidateValidation = Joi.object({
  avatar_name: Joi.string().optional(),
  email: Joi.string().optional(),
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().required(),
  }).optional(),
  avatar_image: Joi.object({
    image_type: Joi.string().required(),
    base64_data: Joi.string().required(),
  }).optional(),
})
