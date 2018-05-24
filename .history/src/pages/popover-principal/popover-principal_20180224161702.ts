import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
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

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          this.selectedLanguage = this.selectedLanguage;
          // if (this.selectedLanguage == 'pt-br') {
          //   this.loadingText = 'Aguarde...';
          // } else {
          //   this.loadingText = 'Wait...';
          // }
        }
        this.translate.use(this.selectedLanguage);

  }

}
