import { Module } from '@nestjs/common';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminAuthService } from './services/admin-auth.service';
import { DatabaseModule } from 'src/libs/databases/database.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    AdminModule,
  ],
  exports: [AdminAuthService],
  controllers: [AdminAuthController,],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}