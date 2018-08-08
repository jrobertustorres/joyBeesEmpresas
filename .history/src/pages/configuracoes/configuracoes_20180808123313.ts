import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';
// import { EmailComposer } from '@ionic-native/email-composer';
// import { AppVersion } from '@ionic-native/app-version';
// import { Device } from '@ionic-native/device';
// import { Storage } from '@ionic/storage';
import { Constants } from '../../app/constants';

// PAGES
import { ModalTermosPage } from '../modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';
// import { MeusDadosPage } from '../meus-dados/meus-dados';
import { MinhaSenhaPage } from './../minha-senha/minha-senha';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';

// @IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage implements OnInit {
  public languageChangeEvent = new EventEmitter();

  languages = availableLanguages;
  // selectedLanguage = sysOptions.systemLanguage;
  selectedLanguage: any;
  private translate: TranslateService;
  private messagePresentToast: string;
  private titleAlert: string;
  private subTitleAlert: string;
  private socialSharingTitle: string;
  private erroAppSubject: string;
  private erroAppBody: string;
  private infoSuporte: string;
  // private _idioma: any;
  // private loading = null;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              // private emailComposer: EmailComposer,
              // private appVersion: AppVersion,
              // private device: Device,
              private languageProvider: LanguageProvider,
              private languageTranslateService: LanguageTranslateService,
              // private _storage: Storage,
              translate: TranslateService) {

    this.translate = translate;
  }

  ngOnInit() {
    this.getTraducao();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  applyLanguage() {
    localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
    this.languageProvider.getLanguageProvider(this.selectedLanguage);

    // if (this.selectedLanguage != this._idioma) {
    //   localStorage.setItem('selectedLanguage', this.selectedLanguage);
    // } else {
    //   localStorage.setItem('selectedLanguage', this._idioma);
    // }

    // localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);

    // this.translate.use(this.selectedLanguage);
    // this.languageProvider.getLanguageProvider(this.selectedLanguage);
    
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.messagePresentToast,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  openModalPolitica(){
    let modal = this.modalCtrl.create(ModalPoliticaPrivacidadePage);
    modal.present();
  }

  // sendEmailBug() {
  //   this.emailComposer.isAvailable().then((available: boolean) =>{
  //     if(available) {
  //     }
  //    });
     
  //    let email = {
  //      to: 'diretoria@logiic.com.br',
  //      cc: ['jose@logiic.com.br', 'bruno@logiic.com.br'],
  //      subject: this.erroAppSubject,
  //      body: '<p><h1>'+ this.erroAppBody +'</h1></p>' +
  //      '<h1>'+ this.infoSuporte +'</h1>'+
  //      '<h1>JoyBees v'+ this.appVersion.getVersionCode() +'</h1>' +
  //      '<h1>'+ this.device.model +'</h1>' +
  //      '<h1>'+ this.device.platform +' '+ this.device.version +'</h1>' +
  //      '<h1>----------------------</h1>',
  //      isHtml: true
  //    };

  //    this.emailComposer.open(email);
  // }

  // meusDados() {
  //   this.navCtrl.push(MeusDadosPage);
  // }

  minhaSenha() {
    this.navCtrl.push(MinhaSenhaPage);
  }

  showAlertModoCliente() {
    let alert = this.alertCtrl.create({
      title: this.titleAlert,
      subTitle: this.subTitleAlert,
      buttons: ['OK']
    });
    alert.present();
  }

}
