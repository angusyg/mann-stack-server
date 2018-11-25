import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { LogService } from './app/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useLogger(app.get<LogService>(LogService));
  await app.listen(3000);
}
bootstrap();
