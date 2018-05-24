import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  private manterVaga: string;
  private subTitleRemoverVaga: string;
  private removerVaga: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
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
          text: this.manterVaga,
          role: 'cancel',
        },
        {
          text: this.removerVaga,
          cssClass: 'btnDescartCss',
          handler: () => {
            this.descartarCandidatoVaga();
          }
        }
      ]
    });
    alert.present();
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
            this.manterVaga = 'MANTER';
            this.subTitleRemoverVaga = 'Deseja realmente remover esta vaga?';
          } else {
            this.loadingText = 'Wait...';
            this.manterVaga = 'KEEP';
            this.subTitleRemoverVaga = 'Deseja realmente remover esta vaga?';
          }
        }
        this.translate.use(this.selectedLanguage);

  }

}
