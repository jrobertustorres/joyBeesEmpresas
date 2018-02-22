import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-candidatos-vaga-list',
  templateUrl: 'candidatos-vaga-list.html',
})
export class CandidatosVagaListPage {
  public idVaga: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {

    this.idVaga = navParams.get('idVaga');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CandidatosVagaListPage');
  }

}
