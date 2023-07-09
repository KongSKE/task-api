import { HttpException, HttpStatus } from '@nestjs/common';

type ErrorResponse = {
  error_code: HttpStatus;
  error_message: string;
}

export class BusinessLogicHttpException extends HttpException {
  constructor(
    response: ErrorResponse,
  ) {
    super(response, response.error_code);
  }

  getResponse(): string | object {
    return super.getResponse() as ErrorResponse;
  }
}