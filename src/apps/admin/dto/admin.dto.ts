import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";

export class PatchAdminDTO {
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

export const patchAdminValidation = Joi.object({
  avatar_name: Joi.string().optional(),
  email: Joi.string().optional(),
  avatar_image: Joi.object({
    image_type: Joi.string().required(),
    base64_data: Joi.string().required(),
  }).optional(),
})
