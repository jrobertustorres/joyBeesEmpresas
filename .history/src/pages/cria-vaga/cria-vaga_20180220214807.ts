import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cria-vaga',
  templateUrl: 'cria-vaga.html',
})
export class CriaVagaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    
        this.getLanguage();
    
        this.dadosUsuarioForm = this.formBuilder.group({
          'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
          'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
          'genero': ['', Validators.required],
          'idade': ['', Validators.required],
          'nacionalidade': ['', [Validators.required, Validators.maxLength(100)]],
          'experienciaProfissional': ['', [Validators.required, Validators.maxLength(500)]],
          'grauEntendimento': ['', Validators.required],
          'grauFala': ['', Validators.required],
          'grauEscrita': ['', Validators.required],
          'salario': [''],
          'endereco': ['', [Validators.required, Validators.maxLength(300)]],
          'telefonePessoa': ['', Validators.maxLength(50)],
          'telefonePessoa2': ['', Validators.maxLength(50)],
          'idEstado': ['', Validators.required],
          'idCidade': ['', Validators.required],
          'senhaUsuario': [''],
          'confirmSenha': ['']
          // 'statusAceitoTermoUso': ['false']
        }
        );
    
        this.estadosService
          .getEstados()
          .subscribe(dados => {
          this.estados = dados;
        });
    
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CriarVagaPage');
  }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    }
    else if(this.selectedLanguage) {
      console.log(this.selectedLanguage);
      if (this.selectedLanguage == 'pt-br') {
        console.log('passou entro do if');
        this.loading = 'Aguarde...';
        this.messagePresentToast = 'Cadastro atualizado!';
        this.loadingCidades = 'Buscando cidades...';
        this.loadingDados = 'Buscando dados...';
      } else {
        this.loading = 'Wait...';
        this.messagePresentToast = 'Updated registration!';
        this.loadingCidades = 'Searching cities...';
        this.loadingDados = 'Searching data...';
      }
    }
    this.translate.use(this.selectedLanguage);
  }

}
