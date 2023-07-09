const AuthErrorResponseMessage = {
  USERNAME_IS_ALREADY_EXISTED: 'USERNAME_IS_ALREADY_EXISTED',
  EMAIL_IS_ALREADY_EXISTED: 'EMAIL_IS_ALREADY_EXISTED',
};

const AdminErrorResponseMessage = {
  ADMIN_WAS_NOT_FOUND: 'ADMIN_WAS_NOT_FOUND',
  CANNOT_CREATE_ADMIN: 'CANNOT_CREATE_ADMIN',
}

const CandidateErrorResponseMessage = {
  CANDIDATE_WAS_NOT_FOUND: 'CANDIDATE_WAS_NOT_FOUND',
  CANNOT_CREATE_CANDIDATE: 'CANNOT_CREATE_CANDIDATE',
}

const TaskErrorResponseMessage = {
  TASK_WAS_NOT_FOUND: 'TASK_WAS_NOT_FOUND',
  CANNOT_CREATE_TASK: 'CANNOT_CREATE_TASK',
}

const CommentErrorResponseMessage = {
  COMMENT_WAS_NOT_FOUND: 'COMMENT_WAS_NOT_FOUND',
  CANNOT_CREATE_COMMENT: 'CANNOT_CREATE_COMMENT',
}

const FileStorageResponseMessage = {
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
}

export const ErrorResponseMessage = {
  ...AuthErrorResponseMessage,
  ...TaskErrorResponseMessage,
  ...CommentErrorResponseMessage,
  ...AdminErrorResponseMessage,
  ...CandidateErrorResponseMessage,
  ...FileStorageResponseMessage,
  SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  NOT_ACCEPTABLE: 'NOT_ACCEPTABLE',
}
