import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule.forRoot(), SecurityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
