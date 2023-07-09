import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentAdminSystemController } from './controllers/comment.admin_system.controller';
import { DatabaseModule } from 'src/libs/databases/database.module';
import { CommentCandidateSystemController } from './controllers/comment.candidate_system.controller';

@Module({
  imports: [DatabaseModule],
  exports: [CommentService],
  controllers: [
    CommentAdminSystemController,
    CommentCandidateSystemController,
  ],
  providers: [CommentService],
})
export class CommentModule {}
