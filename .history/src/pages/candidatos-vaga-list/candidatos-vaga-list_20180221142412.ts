import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-candidatos-vaga-list',
  templateUrl: 'candidatos-vaga-list.html',
})
export class CandidatosVagaListPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CandidatosVagaListPage');
  }

}
