import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';


@IonicPage()
@Component({
  selector: 'page-detalhe-candidato-vaga',
  templateUrl: 'detalhe-candidato-vaga.html',
})
export class DetalheCandidatoVagaPage {
  languages = availableLanguages;
  selectedLanguage: any;
  private _idioma: string;
  private loadingText: string;
  private translate: TranslateService;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService) {
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
  }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    } else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Aguarde...';
      } else {
        this.loadingText = 'Wait...';
      }
    }
    // this.callDetalheVaga();
    this.translate.use(this.selectedLanguage);
  }

}
