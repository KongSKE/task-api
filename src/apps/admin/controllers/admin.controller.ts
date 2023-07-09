import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AdminAuthGuard, RequestWithAdmin } from 'src/libs/auth/guards/admin-auth.guard';
import { AdminService } from '../services/admin.service';
import { APIResponse } from 'src/libs/utils/api-response';
import { AdminDocument } from 'src/libs/databases/schemas/admin.schema';
import { BusinessLogicHttpException } from 'src/libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'src/libs/constants/api.constant';
import { JoiValidationPipe } from 'src/libs/pipe/joi-validation.pipe';
import { PatchAdminDTO, patchAdminValidation } from '../dto/admin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@UseGuards(AdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get()
  async getAllAdmin(
    @Query('textToSearch') textToSearch: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
  ): Promise<APIResponse<{
    admins: AdminDocument[],
    skip: number,
    limit: number,
    total: number
  }
  >> {
    const regex = textToSearch ? new RegExp(textToSearch) : undefined;
    const queries = {
      ...(regex ? { email: { $regex: regex, $options: 'i' } } : {}),
    };
    const [admins, adminsCount] = await Promise.all([
      this.adminService.getMany({
        queries,
        skip,
        limit,
      }),
      this.adminService.getCount({
        queries,
      }),
    ]);
    return { success: true, admins, skip, limit, total: adminsCount };
  }

  @Get('me')
  async getMe(@Req() req: RequestWithAdmin): Promise<APIResponse<{ admin: AdminDocument }>> {
    const admin = await this.adminService.getOne({
      queries: { _id: req.admin._id },
      select: '+avatar_image',
    });
    if (!admin) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.ADMIN_WAS_NOT_FOUND,
      })
    }
    return { success: true, admin };
  }

  @Get(':id')
  async getAdminById(
    @Param('id') id: string,
  ): Promise<APIResponse<{ admin: AdminDocument }>> {
    const admin = await this.adminService.getOne({
      queries: { _id: id },
      select: '+avatar_image',
    })
    if (!admin) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.ADMIN_WAS_NOT_FOUND,
      })
    }
    return { success: true, admin };
  }

  @Patch('me')
  async editMe(
    @Req() req: RequestWithAdmin,
    @Body(new JoiValidationPipe(patchAdminValidation)) body: PatchAdminDTO
  ): Promise<APIResponse<{ admin: AdminDocument }>> {
    const admin = await this.adminService.model.findByIdAndUpdate(req.admin._id, {
      $set: body,
    }, { new: true });
    if (!admin) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.ADMIN_WAS_NOT_FOUND,
      })
    }
    return { success: true, admin };
  }
}
