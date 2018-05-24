import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.idVaga = navParams.get('idVaga');
                
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPrincipalPage');
  }

}
