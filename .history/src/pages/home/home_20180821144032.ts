import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController, AlertController } from 'ionic-angular';
// import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//PAGES
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { PrincipalPage } from '../principal/principal';
import { ModalTermosPage } from '../modal-termos/modal-termos';

//SERVICES
// import { VagaService } from '../../providers/vaga-service';
import { LoginService } from '../../providers/login-service';
import { FornecedorService } from '../../providers/fornecedor-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
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
  // private usuarioEntity: UsuarioEntity;
  private preCadastroEntity: PreCadastroEntity;

  selectedLanguage = null;
  private loading = null;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu : MenuController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              private loginService: LoginService, 
              private fornecedorService: FornecedorService,
              private languageProvider: LanguageProvider,
              private languageTranslateService: LanguageTranslateService, 
              public modalCtrl: ModalController) {

    // this.usuarioEntity = new UsuarioEntity();
    this.preCadastroEntity = new PreCadastroEntity();

  }

  ngOnInit() {
    console.log('dentro do ngOnInit');
    this.getTraducao();
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
   this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
    this.getTraducao(); // aqui temos a chamar novamente para funcionar a altera????o da linguagem no menu
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

  getTraducao() {
    try {

      console.log('dentro do translate');

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  goRecuperarSenha() {
    this.navCtrl.push(RecuperarSenhaPage);
  }

  submeterLogin() {
    try {

      if (this.loginForm.valid) {

        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
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
          content: this.languageDictionary.LOADING_TEXT,
        });
        this.loading.present();

        this.preCadastroEntity = this.cadastrarEmpresaForm.value;

        this.fornecedorService.preCadastroFornecedor(this.preCadastroEntity)
          .then((preCadastroEntityResult: PreCadastroEntity) => {

            this.loading.dismiss();
            this.showAlertPreCadastro();
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

  showAlertPreCadastro() {
    const alert = this.alertCtrl.create({
      title: this.languageDictionary.TITLE_CONTATO_ENVIADO,
      subTitle: this.languageDictionary.SUBTITLE_CONTATO_ENVIADO,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.setRoot(HomePage);
        }
      }]
    });
    alert.present();
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

}
