import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
  private loading: any;
  private translate: TranslateService;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              translate: TranslateService) {
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
  }

  getDetalheCandidatoVaga() {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity.idVaga = this.idVaga;
   
      this.vagaService.findVagaDetalhe(this.vagaDetalheEntity)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.vagaDetalheEntity = vagaDetalheEntityResult;
          this.loading.dismiss();
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
    } else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Aguarde...';
      } else {
        this.loadingText = 'Wait...';
      }
    }
    this.getDetalheCandidatoVaga();
    this.translate.use(this.selectedLanguage);
  }

}
