import { Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { APIResponse } from 'src/libs/utils/api-response';
import { TaskDocument } from 'src/libs/databases/schemas/task.schema';
import { BusinessLogicHttpException } from 'src/libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'src/libs/constants/api.constant';
import { CandidateAuthGuard, RequestWithCandidate } from 'src/libs/auth/guards/candidate-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task (candidate system)')
@UseGuards(CandidateAuthGuard)
@Controller('candidate-system/task')
export class TaskCandidateSystemController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Get('me')
  async getAllMyTasks(
    @Req() req: RequestWithCandidate,
    @Query('textToSearch') textToSearch: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(5), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
  ): Promise<APIResponse<{ tasks: TaskDocument[], skip: number, limit: number, total: number }>> {
    const regex = textToSearch ? new RegExp(textToSearch) : undefined;
    const queries = {
      ...(regex ? { title: { $regex: regex, $options: 'i' } } : {}),
      $or: [
        { is_archived: false, },
        { is_archived: { $exists: false } },
      ],
      assigned_to: req.candidate._id,
    }
    const [tasks, tasksCount] = await Promise.all([
      this.taskService.getMany({
        queries,
        populate: [{ path: 'created_by' }],
        skip,
        limit,
        sortQuery: { created_at: 1 },
      }),
      this.taskService.getCount({ queries }),
    ]);
    return { success: true, tasks, skip, limit, total: tasksCount };
  }

  @Get()
  async getAllTasks(
    @Query('textToSearch') textToSearch: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(3), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
    @Query('status') status?: string,
  ): Promise<APIResponse<{ tasks: TaskDocument[], skip: number, limit: number, total: number }>> {
    const regex = textToSearch ? new RegExp(textToSearch) : undefined;
    const queries = {
      ...(regex ? { title: { $regex: regex, $options: 'i' } } : {}),
      $or: [
        { is_archived: false, },
        { is_archived: { $exists: false } },
      ],
      ...(status ? { status } : {}),
    }
    const [tasks, tasksCount] = await Promise.all([
      this.taskService.getMany({
        queries,
        populate: [{ path: 'created_by' }],
        skip,
        limit,
        sortQuery: { created_at: 1 },
      }),
      this.taskService.getCount({ queries }),
    ]);
    return { success: true, tasks, skip, limit, total: tasksCount };
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<APIResponse<{ task: TaskDocument }>> {
    const task = await this.taskService.getOne({
      queries: {
        _id: id,
        $or: [
          { is_archived: false, },
          { is_archived: { $exists: false } },
        ],
      },
      populate: [{ path: 'created_by' }],
    })
    if (!task) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.TASK_WAS_NOT_FOUND,
      });
    }
    return { success: true, task };
  }
}
