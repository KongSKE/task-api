import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/database.module';
import { TaskService } from './services/task.service';
import { TaskAdminSystemController } from './controllers/task.admin_system.controller';
import { TaskCandidateSystemController } from './controllers/task.candidate_system.controller';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { CandidateAuthModule } from '../candidate-auth/candidate-auth.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  exports: [TaskService],
  controllers: [
    TaskAdminSystemController,
    TaskCandidateSystemController,
  ],
  providers: [TaskService],
})
export class TaskModule {}
