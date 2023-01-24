import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  //atributos
  endpoint:string = environment.apiUrl + "api/Empresas";
  empresas: any[] = []; //array json (vazio)
 
  mensagem_cadastro: string = '';
  mensagem_edicao: string = '';
  mensagem_exclusao: string = '';
 
  //construtor da classe
  constructor(
    //declarando e inicializando um objeto do tipo HttpClient
    private httpClient: HttpClient
  ) {
 
  }
 
  //função executada sempre que a página for aberta
  ngOnInit(): void {
       
    //fazendo uma chamada para a API (GET /api/Empresas)
    this.httpClient.get(this.endpoint)
      .subscribe( //capturando o retorno da API
        (dados) => { //variável para receber a resposta da api
          this.empresas = dados as any[];
        }
      );
  }
 
  //desenvolvendo a estrutura do formulário de cadastro
  formCadastro = new FormGroup({
    nomeFantasia: new FormControl('',
      [Validators.required, Validators.minLength(6), Validators.maxLength(150)]),
    razaoSocial: new FormControl('',
      [Validators.required, Validators.minLength(6), Validators.maxLength(150)]),
    cnpj: new FormControl('',
      [Validators.required])
  });
 
  //desenvolvendo a estrutura do formulário de edição
  formEdicao = new FormGroup({
    idEmpresa: new FormControl('',
      [Validators.required]),
    nomeFantasia: new FormControl('',
      [Validators.required, Validators.minLength(6), Validators.maxLength(150)])
  });
 
  //função para exibir as mensagens de validação dos campos
  get form_cadastro(): any {
    return this.formCadastro.controls;
  }
 
  //função para exibir as mensagens de validação dos campos
  get form_edicao(): any {
    return this.formEdicao.controls;
  }
 
  //função para capturar o submit do formulário de cadastro
  cadastrarEmpresa(): void {
   
    //fazendo a requisição para o ENDPOINT POST
    this.httpClient.post(this.endpoint, this.formCadastro.value)
      .subscribe({
        next: (result: any) => { //capturando o retorno de sucesso da API
          this.mensagem_cadastro = result.mensagem;
          this.formCadastro.reset(); //limpando os campos do formulário
          this.ngOnInit(); //executando a função que irá consultar as empresas
        },
        error: (e: any) => { //capturando o retorno de erro da API
          this.mensagem_cadastro = e.error.mensagem;
        }
      });
  }
 
  //função para buscar o registro de 1 empresa na API
  obterEmpresa(idEmpresa: string): void {
 
    //fazendo uma requisição para a API consultar a empresa atraves do ID
    this.httpClient.get(this.endpoint + "/" + idEmpresa)
      .subscribe(
        (dados: any) => { //capturando a resposta de sucesso da API
          //preenchendo o formulário de edição com os dados da empresa obtida
          this.formEdicao.patchValue(dados);
        }
      );
  }
 
  //função para capturar o submit do formulário de edição
  atualizarEmpresa(): void {
   
    //fazendo uma requisição PUT para a API
    this.httpClient.put(this.endpoint, this.formEdicao.value)
      .subscribe({
        next: (result: any) => { //capturando mensagem de sucesso
          this.mensagem_edicao = result.mensagem;
          this.ngOnInit();
        },
        error: (e: any) => { //capturando mensagem de erro
          this.mensagem_edicao = e.error.mensagem;
        }
      });
  }
 
 //função para realizar a exclusão da empresa
 excluirEmpresa(idEmpresa: string): void{

  //verificar se o usuário deseja excluir a empresa
  if(window.confirm('Deseja realmente excluir a empresa selecionada?')){

    //fazendo uma requisição para o serviço de exclusão de empresa
    this.httpClient.delete(this.endpoint + "/" + idEmpresa)
      .subscribe({
        next: (result: any) => {
          this.mensagem_exclusao = result.mensagem;
          this.ngOnInit();
        },
        error: (e: any) => {
          this.mensagem_exclusao = e.error.mensagem;
        }
      })

  }

 }


}
 


