import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
// import { Storage } from '@ionic/storage';

//PAGES
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { PrincipalPage } from '../principal/principal';
import { ModalTermosPage } from '../modal-termos/modal-termos';
// import { LoginPage } from '../login/login';
// import { MeusDadosPage } from '../meus-dados/meus-dados';
// import { DetalheVagaPage } from './../detalhe-vaga/detalhe-vaga';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
import { LoginService } from '../../providers/login-service';
import { FornecedorService } from '../../providers/fornecedor-service';

//ENTITYS
// import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { UsuarioEntity } from '../../model/usuario-entity';
import { PreCadastroEntity } from '../../model/pre-cadastro-entity';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  segment: string = "login"; // default button
  public loginForm: FormGroup;
  public cadastrarEmpresaForm: FormGroup;
  private usuarioEntity: UsuarioEntity;
  private preCadastroEntity: PreCadastroEntity;

  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private loadingText: string;
  private loading = null;
  private vagas;
  private _idioma: string;
  private loadingDestaques = null;

  private titleNaoLogado: string;
  private subTitleNaoLogado: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu : MenuController,
              translate: TranslateService,
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              // private _storage: Storage,
              private formBuilder: FormBuilder,
              private loginService: LoginService, 
              private fornecedorService: FornecedorService, 
              public modalCtrl: ModalController) {

    this.translate = translate;

    this.usuarioEntity = new UsuarioEntity();
    this.preCadastroEntity = new PreCadastroEntity();

  }

  ngOnInit() {
    this.getLanguage();
    this.loginForm 	= this.formBuilder.group({
      'login': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'senha': ['', Validators.required]
   });
    this.cadastrarEmpresaForm 	= this.formBuilder.group({
      'nomeFantasia': ['', Validators.required],
      'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'pessoaContato': ['', Validators.required],
      'telefone': ['', Validators.required],
   });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  goRecuperarSenha() {
    this.navCtrl.push(RecuperarSenhaPage);
  }

  submeterLogin() {
    try {

      if (this.loginForm.valid) {

        this.loading = this.loadingCtrl.create({
          content: this.loadingText
        });
        this.loading.present();

      this.loginService.loginFornecedor(this.loginForm.value)
        .then((usuarioEntityResult: UsuarioEntity) => {
          this.navCtrl.setRoot(PrincipalPage);

          this.loading.dismiss();
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
      } else {
        Object.keys(this.loginForm.controls).forEach(campo => {
          const controle = this.loginForm.get(campo);
          controle.markAsTouched();
        })
      }
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  submeterPreCadastroEmpresa() {
    try {

      if (this.cadastrarEmpresaForm.valid) {

        this.loading = this.loadingCtrl.create({
          content: this.loadingText
        });
        this.loading.present();

        this.preCadastroEntity = this.cadastrarEmpresaForm.value;

        this.fornecedorService.preCadastroFornecedor(this.preCadastroEntity)
          .then((preCadastroEntityResult: PreCadastroEntity) => {

            //CHAMAR UM ALERT AQUI FICA MELHOR
            // this.navCtrl.setRoot(HomePage);

            this.loading.dismiss();
          }, (err) => {
            this.loading.dismiss();
            this.alertCtrl.create({
              subTitle: err.message,
              buttons: ['OK']
            }).present();
        });
      } else {
        Object.keys(this.cadastrarEmpresaForm.controls).forEach(campo => {
          const controle = this.cadastrarEmpresaForm.get(campo);
          controle.markAsTouched();
        })
      }
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  getLanguage() {
    // localStorage.removeItem(Constants.IDIOMA_USUARIO);
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    console.log(this._idioma);
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    console.log(localStorage.getItem(Constants.IDIOMA_USUARIO));
    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Aguarde...';
      } else {
        this.loadingText = 'Wait...';
      }
    } else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Aguarde...';
        this.titleNaoLogado = 'Você não está logado!';
        this.subTitleNaoLogado = 'Para se candidatar a alguma vaga, é necessário fazer login!';
      } else {
        this.loadingText = 'Wait...';
        this.titleNaoLogado = 'You are not logged in!';
        this.subTitleNaoLogado = 'To apply for a job, you must login!';
      }
    }
    this.translate.use(this.selectedLanguage);
  }

}
