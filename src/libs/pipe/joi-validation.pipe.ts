import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema, StringSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema | StringSchema) {}

  transform(toBeValidateValue: any) {
    const { error, value } = this.schema.validate(toBeValidateValue);
    if (error) {
      throw new BadRequestException('Validation failed', error.toString());
    }
    return value;
  }
}
