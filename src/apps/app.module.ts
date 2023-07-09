import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../libs/config/app.config';
import { DatabaseModule } from 'src/libs/databases/database.module';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { CandidateAuthModule } from './candidate-auth/candidate-auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { AdminModule } from './admin/admin.module';
import { CommentModule } from './comment/comment.module';
import { FileStorageModule } from './file-storage/file-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secretKey'),
      }),
      inject: [ConfigService],
      global: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('mongodb.host');
        const database = configService.get<string>('mongodb.database');
        const port = configService.get<string>('mongodb.port');
        console.log(`mongodb://${host}:${port}/${database}`);
        
        return { uri: `mongodb://${host}:${port}/${database}` };
      },
      inject: [ConfigService],
    }),
    TaskModule,
    AdminModule,
    AdminAuthModule,
    CandidateModule,
    CandidateAuthModule,
    CommentModule,
    FileStorageModule,
  ],
})
export class AppModule {}
