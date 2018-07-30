import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

//PAGES
import { CriaVagaPage } from './../cria-vaga/cria-vaga';

@IonicPage()
@Component({
  selector: 'page-vagas-arquivadas-list',
  templateUrl: 'vagas-arquivadas-list.html',
})
export class VagasArquivadasListPage {
  private vagaDetalheEntity: VagaDetalheEntity;
  private vagaListaEntity: VagaListaEntity;
  private vagasArquivadas;
  private loadingText: string;
  private loading = null;
  private _idioma: string;

  languages = availableLanguages;
  private selectedLanguage = null;
  private translate: TranslateService;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              translate: TranslateService,
              public loadingCtrl: LoadingController) {

    this.translate = translate;
    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.vagaListaEntity = new VagaListaEntity();
  }

  ngOnInit() {
    this.getLanguage();
    this.getVagasArquivadas();
  }

  ionViewDidLoad() {
  }

  doRefreshVagasArquivadas(refresher) {
    this.getVagasArquivadas();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.getVagasArquivadas();
      infiniteScroll.complete();
    }, 500);
  }

  getVagasArquivadas() {
    try {
      this.vagaDetalheEntity.limiteDados = this.vagaDetalheEntity.limiteDados ? this.vagasArquivadas.length : null;

      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.findVagaFinalizadasFornecedorByVaga(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagasArquivadas = vagasListaEntityResult;
          this.vagasArquivadas.limiteDados = this.vagasArquivadas.length;

          console.log(this.vagasArquivadas);

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

  callTelaCriarVagaByIdVaga(idVaga) {
    this.navCtrl.push(CriaVagaPage, {
      idVaga: idVaga
    })
  }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    // this._storage.get('selectedLanguage').then((selectedLanguage) => {
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          this.selectedLanguage = this.selectedLanguage;
          if (this.selectedLanguage == 'pt-br') {
            this.loadingText = 'Procurando vagas...';
          } else {
            this.loadingText = 'Looking for vacancies...';
          }
        }
        // this.getVagasDestaquePrincipal();
        this.translate.use(this.selectedLanguage);

      // });

  }

}
