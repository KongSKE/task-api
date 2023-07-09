import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/database.module';
import { CandidateService } from './services/candidate.service';
import { CandidateAdminSystemController } from './controllers/candidate.admin_system.controller';
import { CandidateCandidateSystemController } from './controllers/candidate.candidate_system.coontroller';

@Module({
  imports: [DatabaseModule],
  exports: [CandidateService],
  controllers: [
    CandidateAdminSystemController,
    CandidateCandidateSystemController,
  ],
  providers: [CandidateService],
})
export class CandidateModule {}
