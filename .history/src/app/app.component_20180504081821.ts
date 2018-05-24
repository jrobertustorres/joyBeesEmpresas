import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Constants } from '../app/constants';
// import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';

//PAGES
import { MenuPage } from '../pages/menu/menu';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

@Component({
  template: '<ion-nav #baseNav></ion-nav>'
})

export class MyApp {
  @ViewChild('baseNav') nav: Nav;
  rootPage:any;

  languages = availableLanguages;
  selectedLanguage: any;
  private translate: TranslateService;
  private titleConection: string;
  private subTitleConection: string;
  private _idioma: string;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              translate: TranslateService,
              private appVersion: AppVersion,
              private _storage: Storage) {

    this.initializeApp();
    
    // this.appVersion.getPackageName();
    this._storage.set(Constants.APP_NAME, this.appVersion.getAppName());
    this._storage.set(Constants.VERSION_CODE, this.appVersion.getVersionCode());
    this._storage.set(Constants.VERSION_NUMBER, this.appVersion.getVersionNumber());
    
    this.translate = translate;
  }

  ngOnInit() {
    this.getLanguage();
    this.nav.push(MenuPage, { animate: false });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // aqui checamos a conexão ao entrar no app
      // this.checkNetwork();
      // abaixo verificamos se a intenet cair depois que o cliente já entrou no app
      // this.network.onDisconnect().subscribe(() => {
      //   let alertDisconect = this.alertCtrl.create({
      //     title: this.titleConection,
      //     subTitle: this.subTitleConection,
      //     buttons: [{
      //        text: 'Ok',
      //        handler: () => {
      //            this.platform.exitApp();
      //           }
      //        }]
      //      });
      //      alertDisconect.present();
      // });
    });
  }

  // checkNetwork() {
  //   if(this.network.type === 'none') {
  //     let alert = this.alertCtrl.create({
  //     title: this.titleConection,
  //     subTitle: this.subTitleConection,
  //     buttons: [{
  //        text: 'Ok',
  //        handler: () => {
  //            this.platform.exitApp();
  //           }
  //        }]
  //      });
  //    alert.present();
  //   }
  // }

  getLanguage(){
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          if (this.selectedLanguage == 'pt-br') {
            this.titleConection = 'Conexão de internet!';
            this.subTitleConection = 'Você está offline. Verifique sua conexão de rede!';
          } else {
            this.titleConection = 'Internet Connection!';
            this.subTitleConection = 'You are offline. Please Check Your Network connection!';
          }
        }
        this.translate.use(this.selectedLanguage);

  }

}
