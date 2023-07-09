import { Body, Controller, Get, HttpStatus, Patch, Req, UseGuards } from "@nestjs/common";
import { CandidateService } from "../services/candidate.service";
import { CandidateAuthGuard, RequestWithCandidate } from "src/libs/auth/guards/candidate-auth.guard";
import { APIResponse } from "src/libs/utils/api-response";
import { CandidateDocument } from "src/libs/databases/schemas/candidate.schema";
import { BusinessLogicHttpException } from "src/libs/core/BusinessLogicHttpException";
import { ErrorResponseMessage } from "src/libs/constants/api.constant";
import { JoiValidationPipe } from "src/libs/pipe/joi-validation.pipe";
import { PatchCandidateDTO, patchCandidateValidation } from "../dto/candidate.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Candidate (candidate system)')
@UseGuards(CandidateAuthGuard)
@Controller('candidate-system/candidate')
export class CandidateCandidateSystemController {
  constructor(
    private readonly candidateService: CandidateService,
  ) { }

  @Get('healthz')
  getHealthz() {
    return { success: true };
  }

  @Get('me')
  async getMe(@Req() req: RequestWithCandidate): Promise<APIResponse<{ candidate: CandidateDocument }>> {
    const candidate = await this.candidateService.getOne({
      queries: { _id: req.candidate._id },
      select: '+avatar_image',
    });
    if (!candidate) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.CANDIDATE_WAS_NOT_FOUND,
      })
    }
    return { success: true, candidate };
  }

  @Patch('me')
  async editMe(
    @Req() req: RequestWithCandidate,
    @Body(new JoiValidationPipe(patchCandidateValidation)) body: PatchCandidateDTO
  ): Promise<APIResponse<{ candidate: CandidateDocument }>> {
    const candidate = await this.candidateService.model.findByIdAndUpdate(req.candidate._id, {
      $set: body,
    }, { new: true });
    if (!candidate) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.CANDIDATE_WAS_NOT_FOUND,
      })
    }
    return { success: true, candidate };
  }
}