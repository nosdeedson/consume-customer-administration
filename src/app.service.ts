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

  saveCustomers(): string {

    let user = {
      "ejs:CustomerDetail": {
        "ejs:email": 'teste@testenest',
        "ejs:name": 'nest nest',
        "ejs:phone": 11111111
      }
    }
    this.soap.save(user);
    const xml = json2xml(JSON.stringify(user), { compact: true })
    return xml
  }
}
