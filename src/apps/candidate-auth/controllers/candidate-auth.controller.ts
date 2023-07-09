import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ErrorResponseMessage } from 'src/libs/constants/api.constant';
import { BusinessLogicHttpException } from 'src/libs/core/BusinessLogicHttpException';
import { JoiValidationPipe } from 'src/libs/pipe/joi-validation.pipe';
import { candidateAuthService } from '../services/candidate-auth.service';
import { CandidateAuthLoginDTO, CandidateAuthLoginValidation, CandidateAuthRegisterDTO, CandidateAuthRegisterValidation } from '../dto/candidate-auth.dto';
import { APIResponse } from 'src/libs/utils/api-response';
import { CandidateService } from 'src/apps/candidate/services/candidate.service';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Candidate Authentication')
@Controller('candidate-auth')
export class CandidateAuthController {
  constructor(
    private readonly candidateAuthService: candidateAuthService,
    private readonly candidateService: CandidateService,
  ) {}

  @Post('login')
  async signIn(@Body(new JoiValidationPipe(CandidateAuthLoginValidation)) body: CandidateAuthLoginDTO): Promise<APIResponse<{ access_token: string }>> {
    const validationResult = await this.candidateAuthService.validateUser(body.username, body.password);
    if (validationResult.success) {
      const accessToken = this.candidateAuthService.generateAccessToken(validationResult.user);
      return { success: true, access_token: accessToken }
    }
    throw new BusinessLogicHttpException({
      error_code: HttpStatus.UNAUTHORIZED,
      error_message: ErrorResponseMessage.UNAUTHORIZED,
    });
  }

  @Post('register')
  async register(@Body(new JoiValidationPipe(CandidateAuthRegisterValidation)) body: CandidateAuthRegisterDTO): Promise<APIResponse> {
    const duplicatedUser = await this.candidateService.getOne({
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
    const user = await this.candidateService.createOne(body);
    if (!user) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.CANNOT_CREATE_CANDIDATE,
      })
    }
    return { success: true };
  }
}
