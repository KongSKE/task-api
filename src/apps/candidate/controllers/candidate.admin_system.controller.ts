import { Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { CandidateService } from "../services/candidate.service";
import { AdminAuthGuard } from "src/libs/auth/guards/admin-auth.guard";
import { BusinessLogicHttpException } from "src/libs/core/BusinessLogicHttpException";
import { ErrorResponseMessage } from "src/libs/constants/api.constant";
import { APIResponse } from "src/libs/utils/api-response";
import { CandidateDocument } from "src/libs/databases/schemas/candidate.schema";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Candidate (admin system)')
@UseGuards(AdminAuthGuard)
@Controller('admin-system/candidate')
export class CandidateAdminSystemController {
  constructor(
    private readonly candidateService: CandidateService,
  ) { }

  @Get('healthz')
  getHealthz() {
    return { success: true };
  }

  @Get()
  async getAllCandidate(
    @Query('textToSearch') textToSearch: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
  ): Promise<APIResponse<{
    candidates: CandidateDocument[],
    skip: number,
    limit: number,
    total: number
  }
  >> {
    const regex = textToSearch ? new RegExp(textToSearch) : undefined;
    const queries = {
      ...(regex ? { email: { $regex: regex, $options: 'i' } } : {}),
    };
    const [candidates, candidatesCount] = await Promise.all([
      this.candidateService.getMany({
        queries,
        skip,
        limit,
      }),
      this.candidateService.getCount({
        queries,
      }),
    ]);
    return { success: true, candidates, skip, limit, total: candidatesCount };
  }

  @Get(':id')
  async getCandidateById(
    @Param('id') id: string,
  ): Promise<APIResponse<{ candidate: CandidateDocument }>> {
    const candidate = await this.candidateService.getOne({
      queries: { _id: id },
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
}