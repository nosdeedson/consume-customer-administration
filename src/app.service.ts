import { Injectable } from '@nestjs/common';
import { js2xml, json2xml } from 'xml-js';
import { SoapService } from './soap/soap/soap.service';

@Injectable()
export class AppService {

  constructor(private soap: SoapService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getAllCustomers(): Promise<any> {
    return await this.soap.getAll();
  }

  async saveCustomers(): Promise<string> {

    let user = {
      "ejs:CustomerDetail": {
        "ejs:email": 'teste@testenest',
        "ejs:name": 'nest nest',
        "ejs:phone": 11111111
      }
    }
    return await this.soap.save(user);
  }
}
