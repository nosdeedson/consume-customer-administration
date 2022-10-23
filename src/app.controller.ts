import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('soap')
  async getAll(): Promise<any>{
    return await this.appService.getAllCustomers();
  }

  @Post() 
  async saveCustomers() : Promise<string>{
    return await this.appService.saveCustomers();
  }
}
