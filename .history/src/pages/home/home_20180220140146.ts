import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';

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
  FB_APP_ID: number = 210518629503681;
  segment: string = "vagasDestaque"; // default button
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
              public fb: Facebook,
              private loginService: LoginService, 
              public modalCtrl: ModalController) {

    this.translate = translate;
    // this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    // this.selectedLanguage = localStorage.getItem('selectedLanguage') == null ? this._idioma : localStorage.getItem('selectedLanguage');
    // console.log(this.selectedLanguage);
    // this.translate.use(this.selectedLanguage);

    this.usuarioEntity = new UsuarioEntity();

    this.fb.browserInit(this.FB_APP_ID, "v2.8");

    // this.loading = this.loadingCtrl.create({
    //   content: this.loadingText
    // });
    // this.loading.present();

    // if (this.selectedLanguage == 'pt-br') {
    //   this.loadingText = 'Procurando vagas...';
    // } else {
    //   this.loadingText = 'Looking for vacancies...';
    // }
    // this.loading = this.loadingCtrl.create({
    //   content: this.loadingText
    // });
    // this.loading.present();

  }

  ngOnInit() {
    this.getLanguage();
    // this.getVagasDestaquePrincipal();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  doRefresh(refresher) {
    this.getVagasDestaquePrincipal();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  selectedTabChanged($event): void {
    if ($event._value == "vagasDestaque") {
      this.getVagasDestaquePrincipal();
    }
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
  }

  goMeusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  getVagasDestaquePrincipal() {
    try {
      this.loadingDestaques = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loadingDestaques.present();

      this.vagaService.getVagasHome()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          this.loadingDestaques.dismiss();
      }, (err) => {
        this.loadingDestaques.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  candidatarVaga(idVaga) {
    // localStorage.setItem(Constants.ID_VAGA_CANDIDATAR, idVaga);
    this._storage.set(Constants.ID_VAGA_CANDIDATAR, idVaga);

    this._storage.get(Constants.ID_USUARIO).then((isLoggedIn) => {
      if(!isLoggedIn){
        this.showAlertNaoLogado();
      }
      // else if(isLoggedIn) {
      //     this.navCtrl.setRoot(DetalheVagaPage, {idVaga: this.nativeStorage.getItem(Constants.ID_VAGA_CANDIDATAR)});
      // }
  });

    // if(!localStorage.getItem(Constants.ID_USUARIO)) {
    //   this.showAlertNaoLogado();
    // }
  }

  showAlertNaoLogado() {
    let alert = this.alertCtrl.create({
      title: this.titleNaoLogado,
      subTitle: this.subTitleNaoLogado,
      buttons: ['OK']
    });
    alert.present();
  }

  doFbLogin(){
    let permissions = new Array<string>();
    // let nav = this.navCtrl;
	  let env = this;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];
    this.usuarioEntity = new UsuarioEntity();

    this.fb.login(permissions)
    .then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array<string>();

      //Getting name and gender properties
      env.fb.api("/me?fields=name,gender", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        env._storage.set('userFacebook',
        {
          userID: user.id,
          name: user.name,
          gender: user.gender,
          picture: user.picture,
          email: user.email
        })
        .then(function(){
          this.usuarioEntity.idUsuarioFacebook = user.id;
          this.usuarioEntity.nomePessoa = user.name;
          this.usuarioEntity.genero = user.gender;
          this.usuarioEntity.imagemPessoaBs64 = user.picture;
          this.usuarioEntity.login = user.email;

          this.callLoginFacebook(this.usuarioEntity);

        }, function (error) {
          console.log(error);
        })
      })
    }, function(error){
      console.log(error);
    });
  }

  callLoginFacebook(usuarioEntity) {
    this.loginService.loginFacebook(usuarioEntity)
    .then((usuarioEntityResult: UsuarioEntity) => {

      this._storage.get(Constants.ID_VAGA_CANDIDATAR).then((idVagaCandidatado) => {
        if(!idVagaCandidatado){
          this.navCtrl.setRoot(PrincipalPage);
        }
        else if(idVagaCandidatado) {
            this.navCtrl.setRoot(DetalheVagaPage, {idVaga: idVagaCandidatado});
        }
      });

      this.loading.dismiss();
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
    // nav.push(PrincipalPage);
  }

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

        this.getVagasDestaquePrincipal();

      // });
  }

}
