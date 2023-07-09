import { Module } from '@nestjs/common';
import { FileStorageController } from './controllers/file-storage.controller';
import { FileStorageService } from './services/file-storage.service';

@Module({
  controllers: [FileStorageController],
  providers: [FileStorageService],
})
export class FileStorageModule {}
