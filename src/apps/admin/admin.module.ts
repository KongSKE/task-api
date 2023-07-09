import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/database.module';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [DatabaseModule],
  exports: [AdminService],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
