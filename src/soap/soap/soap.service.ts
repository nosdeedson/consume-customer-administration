import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { resolve } from 'path';
import { Client, createClientAsync, NTLMSecurity } from 'soap';

@Injectable()
export class SoapService {
    // CustomerPortService: {
    //     CustomerPortSoap11: {
    //       GetAllCustomerDetail: [Function (anonymous)],
    //       DeleteCustomerDetail: [Function (anonymous)],
    //       GetCustomerDetail: [Function (anonymous)],
    //       SaveCustomerDetail: [Function (anonymous)]
    //     }

    private async invoke(): Promise<any>{
        let answer
        return await createClientAsync('http://localhost:8080/ws/customers.wsdl', {

                }).then( async (client: Client) => {
                    // console.log(client['CustomerPortService']['CustomerPortSoap11']['GetAllCustomerDetail'])
            const soapHeader = '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" mustUnderstand="1"><wsse:UsernameToken><wsse:Username>ejs</wsse:Username><wsse:Password>123</wsse:Password></wsse:UsernameToken></wsse:Security>';
            // var soapHeader = {
            //     ['wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" mustUnderstand="1"'] : {
            //         'wsse:UsernameToken':{
            //             'wsse:Username': 'ejs',
            //             'wsse:Password': '123'
            //         }
            //     } 
            // }
            // const security = new NTLMSecurity( )
            // var soapHeader = {
            //     "wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" mustUnderstand=\"1\"" : {
            //         'wsse:UsernameToken':{
            //             'wsse:Username': 'ejs',
            //             'wsse:Password': '123'
            //         }
            //     } 
            // }
            client.addSoapHeader(soapHeader);
            let parameter = {
                VersaoSchema: 1,
                MensagemXML: ''
            }
           return await new Promise<any>(resolve =>{
                return client['CustomerPortService']['CustomerPortSoap11']['GetAllCustomerDetail'](parameter, (...arg)=>{
                    resolve(arg)
                })
            })
        }).then( async (response: any[]) =>{
            response[1]['CustomerDetail'].forEach(element => {
                console.log('id:' + element.id + '; email:' + element.email + '; name:' + element.name + '; phone:' + element.phone)
            });
            answer = response[1]['CustomerDetail']
            return answer
        })

    }

    private async saveCustomer(user: any) {
        return await createClientAsync('http://localhost:8080/ws/customers.wsdl', {
            wsdl_options: {
                // "disableCache": true,
                // "envelopekey": 'soapenv',
                // "attributeskey": `xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ejs="http://ejs.com.br"`
            }
        
        })
            .then(async (client: Client) => {
                client.wsdl.options.envelopeKey = 'soapenv';
                client.wsdl.definitions.schemaXmlns.soapenv = 'http://schemas.xmlsoap.org/soap/envelope/'
                // adicionar apenas uma fez, ao contrário toda vez adiciona novamente gerando erro 
                client.wsdl.xmlnsInEnvelope = client.wsdl.xmlnsInEnvelope + ` xmlns:ejs="http://ejs.com.br"`
                const soapHeader = '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" mustUnderstand="1"><wsse:UsernameToken><wsse:Username>ejs</wsse:Username><wsse:Password>123</wsse:Password></wsse:UsernameToken></wsse:Security>';
                client.addSoapHeader(soapHeader);
                
                return await new Promise<any>(resolve => {
                    return client['CustomerPortService']['CustomerPortSoap11']['SaveCustomerDetail'](user, (...arg) => {
                        console.log(client.lastRequest)
                        resolve(arg)
                    })
                })
            }).then(response => {
                console.log(response)

                return response[1].CustomerDetail;
            })
    }


    public async getAll() :Promise<any>{
       return await this.invoke()
    }

    public async save(user: any){
        return await this.saveCustomer(user);
    }
}
