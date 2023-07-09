import { NestFactory } from '@nestjs/core';
import { AppModule } from './apps/app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Task Board')
    .setDescription('The Task Board API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.enableCors({
    origin: [
      /localhost(:\d+)?$/,
    ],
  });
  await app.listen(3000);
}
bootstrap();
