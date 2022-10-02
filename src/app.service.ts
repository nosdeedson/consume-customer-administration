import { Injectable } from '@nestjs/common';
import { SoapService } from './soap/soap/soap.service';

@Injectable()
export class AppService {

  constructor(private soap:SoapService){}

  getHello(): string {
    return 'Hello World!';
  }

  getAllCustomers(): string{
     this.soap.getAll();
     return "soap"
  }
}
