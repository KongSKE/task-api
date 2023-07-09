import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { AdminAuthGuard, RequestWithAdmin } from 'src/libs/auth/guards/admin-auth.guard';
import { CreateCommentDTO, createCommentValidation } from '../dto/comment.dto';
import { JoiValidationPipe } from 'src/libs/pipe/joi-validation.pipe';
import { CommentDocument, CommentOwnership } from 'src/libs/databases/schemas/comment.schema';
import { BusinessLogicHttpException } from 'src/libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'src/libs/constants/api.constant';
import { APIResponse } from 'src/libs/utils/api-response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comment (admin system)')
@UseGuards(AdminAuthGuard)
@Controller('admin-system/comment')
export class CommentAdminSystemController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Get('task/:id')
  async getAllCommentsByTaskId(
    @Param('id') id: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(3), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number, 
  ): Promise<APIResponse<{ comments: CommentDocument[], skip: number, limit: number, total: number }>> {
    const queries = { task_id: id }
    const [comments, commentsCount] = await Promise.all([
      this.commentService.getMany({
        queries,
        populate: [{ path: 'created_by' }],
        sortQuery: { created_at: -1 },
        skip,
        limit,
      }),
      this.commentService.getCount({ queries }),
    ]);
    return { success: true, comments, skip, limit, total: commentsCount };
  }

  @Post()
  async createComment(
    @Req() req: RequestWithAdmin,
    @Body(new JoiValidationPipe(createCommentValidation)) body: CreateCommentDTO,
  ): Promise<APIResponse<{ comment: CommentDocument }>> {
    const comment = await this.commentService.createOne({
      ...body,
      created_by: req.admin._id,
      ownership: CommentOwnership.Admin,
    });
    if (!comment) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.CANNOT_CREATE_COMMENT,
      })
    }
    return { success: true, comment };
  }
}
