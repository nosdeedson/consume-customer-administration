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

  async criarCodigoBarras(): Promise<any> {
    let dados = this.criarDados();
    let barras = '';
    barras += dados.get('codigoBanco');
    barras += dados.get('moeda');
    barras += dados.get('digitoVerificador');
    barras += dados.get('fatorVencimento');
    barras += dados.get('campoLivre').get('agencia');
    barras += dados.get('campoLivre').get('contaCorrente');

    let linhaDigitavel = this.criarLinhaDigitavel(dados);
    return {'barras': barras, "linha": linhaDigitavel};
  }

  private criarLinhaDigitavel(dados: any){
    let linhaDigitavel = '';
    let valoresCalcular1DivGrupo = ''; 
    
    linhaDigitavel += dados.get('codigoBanco')
    linhaDigitavel += dados.get('moeda')
    linhaDigitavel += dados.get('campoLivre').get('agencia');

    valoresCalcular1DivGrupo += dados.get('codigoBanco')
    valoresCalcular1DivGrupo += dados.get('moeda');
    valoresCalcular1DivGrupo += dados.get('campoLivre').get('agencia');

    let primeiroDivGrupo = this.gerarDivisorGrupo(valoresCalcular1DivGrupo.split(''))
    linhaDigitavel += primeiroDivGrupo;

    let contaCorrente = dados.get('campoLivre').get('contaCorrente') as string
    let partOne = contaCorrente.substring(0, (contaCorrente.length / 2)) as string
    let partSecond = contaCorrente.substring((contaCorrente.length / 2)) as string
    let valoresCalcular2DivGrupo = partOne;

    let segundoDivGrupo = this.gerarDivisorGrupo(partOne.split(''));
    linhaDigitavel += partOne;
    linhaDigitavel += segundoDivGrupo;
    let terceiroDivGrupo = this.gerarDivisorGrupo(partSecond.split(''))
    linhaDigitavel += partSecond;
    linhaDigitavel += terceiroDivGrupo;
    linhaDigitavel += dados.get('digitoVerificador')
    linhaDigitavel += dados.get('fatorVencimento')

    return linhaDigitavel;
  }

  private criarDados() {
    let dados = new Map();
    let dadosDigitoVerificador = '';
    dadosDigitoVerificador = '7569';
    dados.set('codigoBanco', '756')
    dados.set('moeda', '9');

    let campoLivre = new Map();
    let agencia = '2'.padStart(5, '0');
    dadosDigitoVerificador += agencia;
    campoLivre.set('agencia', agencia);

    let contaCorrente = '146300021212'.padStart(20, '0');
    dadosDigitoVerificador += contaCorrente; 
    campoLivre.set('contaCorrente', contaCorrente);

    dados.set('campoLivre', campoLivre);

    let fatorVencimento = '91650000013000';
    dadosDigitoVerificador += fatorVencimento;

    dados.set("fatorVencimento", fatorVencimento); 
    let digitoVerificador = this.gerarDigitoVerificador(dadosDigitoVerificador.split(''));  
    dados.set('digitoVerificador', digitoVerificador);
    return dados;
  }

  private gerarDigitoVerificador(valores: string[]) {
    /**
     * O DAC (Dígito de Auto-Conferência) módulo 11, de um número é calculado multiplicando
        cada algarismo, pela seqüência de multiplicadores 2,3,4,5,6,7,8,9,2,3,4.... posicionados da direita para a
        esquerda.
        A soma dos produtos dessa multiplicação é dividida por 11, obtém-se o resto da divisão, este
        resto deve ser subtraído de 11, o produto da subtração é o DAC.
        Observação: Quando o resto da divisão for igual a 0 ou 1, atribuí-se ao DV o digito “0”, e quando for 10,
        atribuí-se ao DV o digito “1”. 
     */

    let somatorio = 0;
    let multiplicador = 2;
    for (let i = (valores.length - 1); i >= 0; i--) {
      // console.log(multiplicador)
      let valor = Number(valores[i])
      let valorMultiplicado = this.multiplicar(valor, multiplicador, false);
      somatorio += valorMultiplicado;
      multiplicador++;
      if (multiplicador === 10) {
        multiplicador = 2;
      }
    }
    let restoDivisao = somatorio % 11;
    if (restoDivisao === 0 || restoDivisao === 1) {
      return '0'
    } else if (restoDivisao === 10) {
      return '1'
    }else{
      let digitoVerificador = 11 - restoDivisao;
      return String(digitoVerificador)
    }
  }

  private gerarDivisorGrupo(valores: string[]) {
    /**
     * O DAC (Dígito de Auto-Conferência) módulo 10, de um número é calculado multiplicando
     *  cada algarismo, pela seqüência de multiplicadores 2, 1, 2, 1, ... posicionados da direita para a esquerda.
     *  A soma dos algarismos do produto é dividida por 10 e o DAC será a diferença entre o divisor (
     *  10 ) e o resto da divisão:
     *  DAC = 10 - (resto da divisão)
     *  Observação: quando o resto da divisão for 0 (zero), o DAC calculado é o 0 (zero). 
     */
    let multiplicarPor2 = true;
    let somatorio = 0;
    for (let i = (valores.length - 1); i >= 0; i--) {
      let valor = Number(valores[i])
      if(multiplicarPor2){
        let retorno = this.multiplicar(valor, 2, true);
        somatorio += retorno
        multiplicarPor2 = false
      }else{
        somatorio += valor;
        multiplicarPor2=true
      }
    }
    let restoDivisao = somatorio % 10;
    if(restoDivisao === 0){
      return '0'
    }
    let digitoVerificador = 10 - restoDivisao;
    return String(digitoVerificador)
  }

  private multiplicar(valor: number, multiplicador: number, modulo10: boolean) {
    let valorMultiplicado = valor * multiplicador;
    if (valorMultiplicado > 9 && modulo10) {
      let valorMultiplicadoString = String(valorMultiplicado)
      let a = Number(valorMultiplicadoString[0])
      let b = Number(valorMultiplicadoString[1])
      valorMultiplicado = a + b;
    }
    return valorMultiplicado;
  }
}
