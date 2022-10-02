import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { resolve } from 'path';
import { Client, createClientAsync, NTLMSecurity } from 'soap';

@Injectable()
export class SoapService {

    private invoke(){

        createClientAsync('http://localhost:8080/ws/customers.wsdl', {

                }).then( (client: Client) => {
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
            console.log(client.getSoapHeaders())
            
            return new Promise<any>(resolve =>{
                return client['GetAllCustomerDetail']( (arg)=>{
                    resolve(arg)
                })
            })
        }).then(response =>{
            console.log(response)
        })

    }

    public getAll(){
       return this.invoke()
    }
}
