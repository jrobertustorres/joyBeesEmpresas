import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Constants } from '../app/constants';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

//PAGES
import { MenuPage } from '../pages/menu/menu';
import { PrincipalPage } from '../pages/principal/principal';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

import { LanguageTranslateService } from '../providers/language-translate-service';
import { Globalization } from '@ionic-native/globalization';

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
  public languageDictionary: any;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              translate: TranslateService,
              private network: Network, 
              private globalization: Globalization,
              private languageTranslateService: LanguageTranslateService,
              private appVersion: AppVersion,
              public push: Push) {

    this.initializeApp();

    this.translate = translate;
  }

  ngOnInit() {
    // this.getLanguage();
    // this.nav.push(MenuPage, { animate: false });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      document.addEventListener('backbutton', () => {
        console.log('Back button tapped');
    }, false);
      this.getLanguegeDefault();
      // this.getLanguage();
      if (this.platform.is('cordova')) {
        this.appVersion.getVersionNumber().then((version) => {
          localStorage.setItem(Constants.VERSION_NUMBER, version);
        })
      }
      this.statusBar.styleDefault();
      this.initPushNotification();
      this.splashScreen.hide();
      // aqui checamos a conexão ao entrar no app
      this.checkNetwork();
      // abaixo verificamos se a intenet cair depois que o cliente já entrou no app
      this.network.onDisconnect().subscribe(() => {
        let alertDisconect = this.alertCtrl.create({
          title: this.titleConection,
          subTitle: this.subTitleConection,
          buttons: [{
             text: 'Ok',
             handler: () => {
                 this.platform.exitApp();
                }
             }]
           });
           alertDisconect.present();
      });
    });
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        // aqui checamos a conexão ao entrar no app
        this.checkNetwork();
        this.nav.push(MenuPage, { animate: false });
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  //OBTENDO O IDIOMA CONFIGURADO NO APARELHO
  getLanguegeDefault() {
    if ((<any>window).cordova) {
      this.globalization.getPreferredLanguage().then(result => {
        let idioma = result.value == 'pt-BR' ? 'pt-br' : 'en';
        localStorage.setItem(Constants.IDIOMA_USUARIO, idioma);
      });
    }
    else {
      let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
      browserLanguage = browserLanguage == 'pt' ? 'pt-br' : 'en';
      console.log(browserLanguage);
      localStorage.setItem(Constants.IDIOMA_USUARIO, browserLanguage);
      console.log(localStorage.getItem(Constants.IDIOMA_USUARIO));
    }
    this.getTraducao();

  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: '464022525717',
        sound   : 'true',
        vibrate : true
        // icon    : 'icon'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      localStorage.setItem(Constants.TOKEN_PUSH, data.registrationId);
    });

    pushObject.on('notification').subscribe((data: any) => {
      if (data.additionalData.foreground) {
        let confirmAlert = this.alertCtrl.create({
          title: 'Nova notificação',
          message: data.message,
          buttons: [{
            text: 'IGNORAR',
            role: 'cancel'
          }, {
            text: 'VER',
            handler: () => {
              this.nav.push(PrincipalPage);
            }
          }]
        });
        confirmAlert.present();
      } else {
        this.nav.push(PrincipalPage);
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

  checkNetwork() {
    if(this.network.type === 'none') {
      let alert = this.alertCtrl.create({
      title: this.titleConection,
      subTitle: this.subTitleConection,
      buttons: [{
         text: 'Ok',
         handler: () => {
             this.platform.exitApp();
            }
         }]
       });
     alert.present();
    }
  }

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
