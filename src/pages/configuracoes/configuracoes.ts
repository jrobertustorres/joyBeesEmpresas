import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';
// import { EmailComposer } from '@ionic-native/email-composer';
// import { AppVersion } from '@ionic-native/app-version';
// import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
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
  private _idioma: any;
  // private loading = null;

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
              private _storage: Storage,
              translate: TranslateService) {

    this.translate = translate;
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
  }

  applyLanguage() {

    if (this.selectedLanguage != this._idioma) {
      this._storage.set('selectedLanguage', this.selectedLanguage);
    } else {
      this._storage.set('selectedLanguage', this._idioma);
    }

    localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);

    this.translate.use(this.selectedLanguage);
    this.languageProvider.getLanguageProvider(this.selectedLanguage);
    
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

  getLanguage(){
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    }
    else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.messagePresentToast = 'Obrigado por compartilhar!';
        this.titleAlert = 'O modo cliente foi ativado!';
        this.subTitleAlert = 'Agora além do modo fornecedor, você poderá usar o app para encontrar prestadores de serviço';
        this.socialSharingTitle = 'Indicação para experimentar o Pet Prático. Tenha todos os Pet Shops em um mesmo lugar. Na palma de sua mão!';
        this.erroAppSubject = 'Problema encontrado no app';
        this.erroAppBody = 'Olá! Descreva abaixo o problema encontrado e logo analizaremos.';
        this.infoSuporte = 'Informações para suporte';
      } else {
        this.messagePresentToast = 'Thanks for sharing!';
        this.titleAlert = 'Client mode has been activated!';
        this.subTitleAlert = 'Now in addition to the vendor mode, you can use the app to find service providers';
        this.socialSharingTitle = 'Indication to try the Practical Pet. Have all Pet Shops in one place. In the palm of your hand!';
        this.erroAppSubject = 'Issue found in app';
        this.erroAppBody = 'Hello! Please describe the problem below and we will discuss it shortly.';
        this.infoSuporte = 'Support Information';
      }
    }
    this.translate.use(this.selectedLanguage);

  }

}
