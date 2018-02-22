import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService) {

    this.idVaga = navParams.get('idVaga');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CandidatosVagaListPage');
  }

}
