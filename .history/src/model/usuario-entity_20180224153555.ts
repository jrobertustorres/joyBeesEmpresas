export class UsuarioEntity {

  public idUsuario: number;
  public idPessoa: number;
  public idFornecedor: number;
  public idVagaUsuario: number;
  
  public nomePessoa: string;
  public nomeFornecedor: string;
  public idUsuarioFacebook: number;
  public login: string;
  public senha: string;
  public token: string;
  public tokenPush: string;
  public tipoUsuario: string;
  public idiomaUsuario: string;
  public statusAceitoTermoUso: boolean;
  public status: boolean;
  
  public novaSenha: string;
  public imagemPessoaBs64: string;
  public isCadastroCompleto: boolean;
  public nomeVaga: string;
  public isFinalista: boolean;
  public qtdUsuariosVaga: number;
  public qtdUsuarioFinalistasVaga: number;

  constructor(){
  }
}
