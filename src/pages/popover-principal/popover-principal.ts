import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';

//PAGES
import { PrincipalPage } from '../principal/principal';

@IonicPage()
@Component({
  selector: 'page-popover-principal',
  templateUrl: 'popover-principal.html',
})
export class PopoverPrincipalPage {
  languages = availableLanguages;
  private selectedLanguage = null;
  private translate: TranslateService;
  public idVaga: number;
  private _idioma: string;
  private loadingText: string;
  private btnManterVaga: string;
  private subTitleRemoverVaga: string;
  private btnRemoverVaga: string;
  private loading = null;
  private messagePresentToast: string;
  private messageRemoverVagaToast: string;
  private vagaListaEntity: VagaListaEntity;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private vagaService: VagaService,
              private toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              translate: TranslateService) {

    this.translate = translate;
    this.idVaga = navParams.get('idVaga');
    this.vagaListaEntity = new VagaListaEntity();
                
  }

  ngOnInit() {
    this.getLanguage();
    console.log(this.idVaga);
  }

  ionViewDidLoad() {
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

  callAlertConfirm() {
    let alert = this.alertCtrl.create({
      subTitle: this.subTitleRemoverVaga,
      buttons: [
        {
          text: this.btnManterVaga,
          role: 'cancel',
        },
        {
          text: this.btnRemoverVaga,
          cssClass: 'btnDescartCss',
          handler: () => {
            this.callFecharVaga();
          }
        }
      ]
    });
    alert.present();
  }

  callFecharVaga() {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.fecharVaga(this.idVaga)
      .then((vagaListaEntityResult: VagaListaEntity) => {
          this.loading.dismiss();
          this.messagePresentToast = this.messageRemoverVagaToast;
          this.presentToast();
          this.viewCtrl.dismiss({
          });
          setTimeout(() => {
            this.navCtrl.setRoot(PrincipalPage);
          }, 3000);
        }, (err) => {
          this.loading.dismiss();
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
  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          this.selectedLanguage = this.selectedLanguage;
          if (this.selectedLanguage == 'pt-br') {
            this.loadingText = 'Aguarde...';
            this.btnManterVaga = 'MANTER';
            this.btnRemoverVaga = 'REMOVER';
            this.subTitleRemoverVaga = 'Deseja realmente remover esta vaga?';
            this.messageRemoverVagaToast = 'A vaga foi removida!';
          } else {
            this.loadingText = 'Wait...';
            this.btnManterVaga = 'KEEP';
            this.btnRemoverVaga = 'REMOVE';
            this.subTitleRemoverVaga = 'Do you really want to remove this vacancy?';
            this.messageRemoverVagaToast = 'The vacancy has been removed!';
          }
        }
        this.translate.use(this.selectedLanguage);

  }

}
