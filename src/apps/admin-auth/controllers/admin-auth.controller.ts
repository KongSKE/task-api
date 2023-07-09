import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AdminAuthService } from '../services/admin-auth.service';
import { APIResponse } from 'src/libs/utils/api-response';
import { BusinessLogicHttpException } from 'src/libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'src/libs/constants/api.constant';
import { AdminAuthLoginDTO, AdminAuthLoginValidation, AdminAuthRegisterDTO, AdminAuthRegisterValidation } from '../dto/admin-auth.dto';
import { JoiValidationPipe } from 'src/libs/pipe/joi-validation.pipe';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/apps/admin/services/admin.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Authentication')
@Controller('admin-auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('login')
  async signIn(@Body(new JoiValidationPipe(AdminAuthLoginValidation)) body: AdminAuthLoginDTO): Promise<APIResponse<{ access_token: string }>> {
    const validationResult = await this.adminAuthService.validateUser(body.username, body.password);
    if (validationResult.success) {
      const accessToken = this.adminAuthService.generateAccessToken(validationResult.user);
      return { success: true, access_token: accessToken }
    }
    throw new BusinessLogicHttpException({
      error_code: HttpStatus.UNAUTHORIZED,
      error_message: ErrorResponseMessage.UNAUTHORIZED,
    });
  }

  @Post('register')
  async register(@Body(new JoiValidationPipe(AdminAuthRegisterValidation)) body: AdminAuthRegisterDTO): Promise<APIResponse> {
    const duplicatedUser = await this.adminService.getOne({
      queries: { 
        $or: [
          { username: body.username },
          { email: body.email },
        ],
      },
    });
    if (duplicatedUser) {
      if (duplicatedUser.username === body.username) {
        throw new BusinessLogicHttpException({
          error_code: HttpStatus.CONFLICT,
          error_message: ErrorResponseMessage.USERNAME_IS_ALREADY_EXISTED,
        })
      }
      if (duplicatedUser.email === body.email) {
        throw new BusinessLogicHttpException({
          error_code: HttpStatus.CONFLICT,
          error_message: ErrorResponseMessage.EMAIL_IS_ALREADY_EXISTED,
        })
      }
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt);
    body.password = hashedPassword;
    const user = await this.adminService.createOne(body);
    if (!user) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.CANNOT_CREATE_ADMIN,
      })
    }
    return { success: true };
  }
}
