import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/database.module';
import { candidateAuthService } from './services/candidate-auth.service';
import { CandidateAuthController } from './controllers/candidate-auth.controller';
import { CandidateModule } from '../candidate/candidate.module';

@Module({
  imports: [
    DatabaseModule,
    CandidateModule,
  ],
  exports: [candidateAuthService],
  controllers: [CandidateAuthController],
  providers: [candidateAuthService],
})
export class CandidateAuthModule {}
