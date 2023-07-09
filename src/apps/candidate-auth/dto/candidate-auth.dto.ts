import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CandidateAuthLoginDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  username: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;
}

export const CandidateAuthLoginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

export class CandidateAuthRegisterDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  username: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  avatar_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    type: {
      first: { type: String },
      last: { type: String },
    },
    required: true,
  })
  name: { first: string, last: string };

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

export const CandidateAuthRegisterValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  avatar_name: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().required(),
  }).required(),
  avatar_image: Joi.object({
    image_type: Joi.string().required(),
    base64_data: Joi.string().required(),
  }).optional(),
})
