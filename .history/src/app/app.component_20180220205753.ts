import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions} from '@ionic-native/push';

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
  // selectedLanguage = sysOptions.systemLanguage;
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
              private _storage: Storage,
              private network: Network, 
              public push: Push) {
    this.initializeApp();
    
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
      this.pushSetup();
      // aqui checamos a conexão ao entrar no app
      this.checkNetwork();
      // this.loginFacebook();
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

  pushSetup() {
    const options: PushOptions = {
     android: {
         senderID: '1143021206'
     },
     ios: {
         alert: 'true',
         badge: true,
         sound: 'false'
     },
     windows: {}
  };

  const pushObject: PushObject = this.push.init(options);

  pushObject.on('notification').subscribe((notification: any) => {
    if (notification.additionalData.foreground) {
      let youralert = this.alertCtrl.create({
        title: 'New Push notification',
        message: notification.message
      });
      youralert.present();
    }
  });

  pushObject.on('registration').subscribe((registration: any) => {
    console.log(registration);
    localStorage.setItem('tokenPush',registration.registrationId);
     //do whatever you want with the registration ID
  });

  pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
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

  // loginFacebook() {
  //   let env = this;
  //   this._storage.get('user')
  //   .then( function (data) {
  //     // user is previously logged and we have his data
  //     // we will let him access the app
  //     // env.nav.push(UserPage);
  //     env.splashScreen.hide();
  //   }, function (error) {
  //     //we don't have the user data so we will ask him to log in
  //     // env.nav.push(LoginPage);
  //     env.splashScreen.hide();
  //   });
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
