import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

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
  private loading = null;
  public languageDictionary: any;
  private refresh: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              private languageTranslateService: LanguageTranslateService,
              public loadingCtrl: LoadingController) {

    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.vagaListaEntity = new VagaListaEntity();
  }

  ngOnInit() {
    this.getTraducao();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getVagasArquivadas();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
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

      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
        });
        this.loading.present();
      }

      this.vagaService.findVagaFinalizadasFornecedorByVaga(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagasArquivadas = vagasListaEntityResult;
          this.vagaDetalheEntity.limiteDados = this.vagasArquivadas.length;

          this.refresh = true;
          this.loading ? this.loading.dismiss() : '';
      }, (err) => {
        this.loading ? this.loading.dismiss() : '';
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

  filtrarPorNomeVaga(filtro) {
    try {
      this.vagaDetalheEntity.limiteDados = this.vagaDetalheEntity.limiteDados ? this.vagasArquivadas.length : null;

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.vagaService.findVagaFinalizadasFornecedorByVaga(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagasArquivadas = vagasListaEntityResult;
          this.vagaDetalheEntity.limiteDados = this.vagasArquivadas.length;

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
      idVaga: idVaga,
      telaVagasArquivadas: true
    })
  }

}
