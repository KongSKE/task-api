import { Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminAuthGuard, RequestWithAdmin } from 'src/libs/auth/guards/admin-auth.guard';
import { TaskService } from '../services/task.service';
import { BusinessLogicHttpException } from 'src/libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'src/libs/constants/api.constant';
import { APIResponse } from 'src/libs/utils/api-response';
import { TaskDocument, TaskToCreate } from 'src/libs/databases/schemas/task.schema';
import { CreateTaskDTO, PatchTaskDTO, createTaskValidation, patchTaskValidation } from '../dto/task.dto';
import { JoiValidationPipe } from 'src/libs/pipe/joi-validation.pipe';
import { TaskStatus } from 'src/libs/utils/enum';
import * as moment from 'moment-timezone';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task (admin system)')
@UseGuards(AdminAuthGuard)
@Controller('admin-system/task')
export class TaskAdminSystemController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Get('me')
  async getAllMyTasks(
    @Req() req: RequestWithAdmin,
    @Query('textToSearch') textToSearch: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(3), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
  ): Promise<APIResponse<{ tasks: TaskDocument[], skip: number, limit: number, total: number }>> {
    const regex = textToSearch ? new RegExp(textToSearch) : undefined;
    const queries = {
      ...(regex ? { title: { $regex: regex, $options: 'i' } } : {}),
      $or: [
        { is_archived: false, },
        { is_archived: { $exists: false } },
      ],
      created_by: req.admin._id,
    }
    const [tasks, tasksCount] = await Promise.all([
      this.taskService.getMany({
        queries,
        skip,
        limit,
        sortQuery: { created_at: 1 },
      }),
      this.taskService.getCount({ queries }),
    ])
    return { success: true, tasks, skip, limit, total: tasksCount };
  }

  @Get()
  async getAllTasks(
    @Query('textToSearch') textToSearch: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(3), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
    @Query('status') status?: string,
  ): Promise<APIResponse<{ tasks: TaskDocument[], skip: number, limit: number, total: number }>> {
    if (status && !(Object.values<string>(TaskStatus).includes(status))) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_ACCEPTABLE,
        error_message: ErrorResponseMessage.NOT_ACCEPTABLE,
      })
    } 
    const regex = textToSearch ? new RegExp(textToSearch) : undefined;
    const queries = {
      $or: [
        { is_archived: false, },
        { is_archived: { $exists: false } },
      ],
      ...(regex ? { title: { $regex: regex, $options: 'i' } } : {}),
      ...(status ? { status } : {}),
    }
    const [tasks, tasksCount ] = await Promise.all([
      this.taskService.getMany({
        queries,
        populate: [{ path: 'created_by' }],
        skip,
        limit,
        sortQuery: { created_at: 1 },
      }),
      this.taskService.getCount({ queries })
    ])
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

  @Post()
  async createTask(
    @Req() req: RequestWithAdmin,
    @Body(new JoiValidationPipe(createTaskValidation)) body: CreateTaskDTO,
  ): Promise<APIResponse<{ task: TaskDocument }>> {
    const task = await this.taskService.createOne({
      ...body,
      created_by: req.admin._id,
    })
    if (!task) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.CANNOT_CREATE_TASK,
      })
    }
    return { success: true, task };
  }

  @Patch(':id')
  async editTask(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(patchTaskValidation)) body: PatchTaskDTO,
  ): Promise<APIResponse<{ task: TaskDocument }>> {
    const task = await this.taskService.model.findByIdAndUpdate(id, {
      $set: { ...body },
    }, { new: true });
    if (!task) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.UNPROCESSABLE_ENTITY,
        error_message: ErrorResponseMessage.UNPROCESSABLE_ENTITY,
      })
    }
    return { success: true, task };
  }

  @Delete('archive/:id')
  async archiveTask(
    @Param('id') id: string,
    @Req() req: RequestWithAdmin,
  ): Promise<APIResponse> {
    const updateResult = await this.taskService.model.updateOne(
      {
        _id: id,
        $or: [
          { is_archived: false, },
          { is_archived: { $exists: false } },
        ],
      },
      {
        $set: {
          is_archived: true,
          archived_by: req.admin._id,
          archived_date: moment().toDate(),
        },
      }
    )
    if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.TASK_WAS_NOT_FOUND,
      });
    }
    return { success: true };
  }
}
