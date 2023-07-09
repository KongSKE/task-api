import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class AdminAuthLoginDTO {
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

export const AdminAuthLoginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

export class AdminAuthRegisterDTO {
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

export const AdminAuthRegisterValidation = Joi.object({
  username: Joi.string().min(5).max(30).required(),
  password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  avatar_name: Joi.string().required(),
  email: Joi.string().email().required(),
  avatar_image: Joi.object({
    image_type: Joi.string().required(),
    base64_data: Joi.string().required(),
  }).optional(),
})
