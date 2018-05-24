import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              translate: TranslateService) {

    this.translate = translate;
    this.idVaga = navParams.get('idVaga');
                
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    this.getLanguage();
    console.log(this.idVaga);
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
      
      console.log(this.idVaga);

      this.loading = this.loadingCtrl.create({
        content: this.loadingDados
      });
      this.loading.present();

      this.vagaService.fecharVaga(this.idVaga)
      .then((usuarioDetalheVagaEntityResult: UsuarioDetalheVagaEntity) => {
          this.loading.dismiss();
          this.messagePresentToast = this.messageDescartarCandidatoToast;
          this.presentToast();
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
          } else {
            this.loadingText = 'Wait...';
            this.btnManterVaga = 'KEEP';
            this.btnRemoverVaga = 'REMOVE';
            this.subTitleRemoverVaga = 'Deseja realmente remover esta vaga?';
          }
        }
        this.translate.use(this.selectedLanguage);

  }

}
