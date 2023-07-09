export interface ErrorResponse {
  success: false;
  error_code?: number;
  error_message?: string;
}

export type APIResponse<Custom = { [key: string]: any }> = ({
  success: true;
} & Custom) | ErrorResponse;

export function decorateErrorResponse(code = 500, message: string): ErrorResponse {
  return {
    success: false,
    error_code: code,
    error_message: message.toString(),
  };
}