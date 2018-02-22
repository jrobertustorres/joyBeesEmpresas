import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';


@IonicPage()
@Component({
  selector: 'page-candidatos-vaga-list',
  templateUrl: 'candidatos-vaga-list.html',
})
export class CandidatosVagaListPage {
  public idVaga: number;
  languages = availableLanguages;
  private selectedLanguage = null;
  private translate: TranslateService;
  private _idioma: string;
  private loadingText: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService) {

    this.translate = translate;
    this.idVaga = navParams.get('idVaga');
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CandidatosVagaListPage');
  }

  getCandidatosVaga(idVaga) {
    try {

      this.loadingText = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loadingText.present();

      this.vagaService.findVagasCandidatadas()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          this.loadingText.dismiss();
      }, (err) => {
        this.loadingText.dismiss();
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
          } else {
            this.loadingText = 'Wait...';
          }
        }
        this.getCandidatosVaga(this.idVaga);
        this.translate.use(this.selectedLanguage);

  }

}
