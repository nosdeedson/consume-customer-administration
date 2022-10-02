import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoapService } from './soap/soap/soap.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,SoapService],
})
export class AppModule {}
