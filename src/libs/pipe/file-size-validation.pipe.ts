import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { BusinessLogicHttpException } from '../core/BusinessLogicHttpException';
import { ErrorResponseMessage } from '../constants/api.constant';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    console.log(value);
    const acceptedType = ['image/png', 'image/jpg']
    if (!value || !acceptedType.includes(value.mimetype)) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.BAD_REQUEST,
        error_message: ErrorResponseMessage.BAD_REQUEST,
      })
    }
    // const oneKb = 1000;
    const exceedLimit = 5000000 // 5 mb
    if (value.size > exceedLimit) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.PAYLOAD_TOO_LARGE,
        error_message: ErrorResponseMessage.IMAGE_TOO_LARGE
      });
    }
    return value;
  }
}