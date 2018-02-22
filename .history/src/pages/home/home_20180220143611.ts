import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

import { Storage } from '@ionic/storage';

//PAGES
// import { LoginPage } from '../login/login';
// import { MeusDadosPage } from '../meus-dados/meus-dados';
// import { ModalTermosPage } from '../modal-termos/modal-termos';
// import { PrincipalPage } from '../principal/principal';
// import { DetalheVagaPage } from './../detalhe-vaga/detalhe-vaga';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
import { LoginService } from '../../providers/login-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { UsuarioEntity } from '../../model/usuario-entity';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  segment: string = "login"; // default button
  public loginForm: FormGroup;
  private usuarioEntity: UsuarioEntity;

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
              private _storage: Storage,
              private formBuilder: FormBuilder,
              private loginService: LoginService, 
              public modalCtrl: ModalController) {

    this.translate = translate;

    this.usuarioEntity = new UsuarioEntity();

  }

  ngOnInit() {
    this.getLanguage();
    this.loginForm 	= this.formBuilder.group({
      // 'login': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'login': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'senha': ['', Validators.required]
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

  // doRefresh(refresher) {
  //   this.getVagasDestaquePrincipal();

  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  // }

  // selectedTabChanged($event): void {
  //   if ($event._value == "vagasDestaque") {
  //     this.getVagasDestaquePrincipal();
  //   }
  // }

  goLogin() {
    // this.navCtrl.push(LoginPage);
  }

  goMeusDados() {
    // this.navCtrl.push(MeusDadosPage);
  }

  openModalTermos(){
    // let modal = this.modalCtrl.create(ModalTermosPage);
    // modal.present();
  }

  // getVagasDestaquePrincipal() {
  //   try {
  //     this.loadingDestaques = this.loadingCtrl.create({
  //       content: this.loadingText
  //     });
  //     this.loadingDestaques.present();

  //     this.vagaService.getVagasHome()
  //       .then((vagasListaEntityResult: VagaListaEntity) => {
  //         this.vagas = vagasListaEntityResult;
  //         this.loadingDestaques.dismiss();
  //     }, (err) => {
  //       this.loadingDestaques.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });
  //   }
  //   catch (err){
  //     if(err instanceof RangeError){
  //       console.log('out of range');
  //     }
  //     console.log(err);
  //   }
  // }


    // if(!localStorage.getItem(Constants.ID_USUARIO)) {
    //   this.showAlertNaoLogado();
    // }




  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    // this._storage.get('selectedLanguage').then((selectedLanguage) => {
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          this.selectedLanguage = this.selectedLanguage;
          if (this.selectedLanguage == 'pt-br') {
            this.loadingText = 'Procurando vagas...';
            this.titleNaoLogado = 'Você não está logado!';
            this.subTitleNaoLogado = 'Para se candidatar a alguma vaga, é necessário fazer login!';
          } else {
            this.loadingText = 'Looking for vacancies...';
            this.titleNaoLogado = 'You are not logged in!';
            this.subTitleNaoLogado = 'To apply for a job, you must login!';
          }
        }
        this.translate.use(this.selectedLanguage);

        // this.getVagasDestaquePrincipal();

      // });
  }

}
