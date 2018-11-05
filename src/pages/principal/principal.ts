import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//PAGES
import { CriaVagaPage } from './../cria-vaga/cria-vaga';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro';
import { CandidatosVagaListPage } from '../candidatos-vaga-list/candidatos-vaga-list';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  // segment: string = "vagasAtivas"; // default button

  // languages = availableLanguages;
  private selectedLanguage = null;
  private translate: TranslateService;
  private vagasAtivas;
  // private vagasArquivadas;
  // private vagas;
  private loadingText: string;
  private loading = null;
  private vagaDetalheEntity: VagaDetalheEntity;
  private vagaListaEntity: VagaListaEntity;
  private _idioma: string;
  public qtdVagasAtivas: number;
  private refresh: boolean = false
  public languageDictionary: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              translate: TranslateService,
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private languageProvider: LanguageProvider,
              private languageTranslateService: LanguageTranslateService,
              public popoverCtrl: PopoverController) {

    this.translate = translate;
    this.translate.use(localStorage.getItem(Constants.IDIOMA_USUARIO));
    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.vagaListaEntity = new VagaListaEntity();

  }

  ngOnInit() {
    this.getTraducao();
    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
      this.getTraducaoEmited(); // aqui temos a chamar novamente para funcionar a alteração da linguagem no menu
    });
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getVagasAtivas(this.vagaDetalheEntity);

      });
    }
    catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  getTraducaoEmited() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;

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

      this.getVagasAtivas(this.vagaDetalheEntity);
      infiniteScroll.complete();
    }, 500);
  }

  doRefreshVagasAtivas(refresher) {
    this.getVagasAtivas(this.vagaDetalheEntity);

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  openModalFiltro(){
    let modal = this.modalCtrl.create(ModalFiltroPage);

    modal.onDidDismiss((data) => {
      if (data) {
        // this.segment = "vagasAtivas";
        this.refresh = false;
        this.getVagasAtivas(data.filter);
      }
    });

    modal.present();
  }

  getVagasAtivas(filtro) {
    try {

      this.vagaDetalheEntity.limiteDados = this.vagaDetalheEntity.limiteDados ? this.vagasAtivas.length : null;
      
      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
        });
        this.loading.present();
      }
      this.vagaDetalheEntity = filtro;

      this.vagaService.findVagaFornecedorByVaga(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagasAtivas = vagasListaEntityResult;
          this.vagaDetalheEntity.limiteDados = this.vagasAtivas.length;

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

  callTelaCriarVaga() {
    this.navCtrl.push(CriaVagaPage);
  }

  callTelaCriarVagaByIdVaga(idVaga) {
    this.navCtrl.push(CriaVagaPage, {
      idVaga: idVaga
    })
  }

  callCandidatosVaga(idVaga, nomeVaga) {
    this.navCtrl.push(CandidatosVagaListPage, {
      idVaga: idVaga,
      nomeVaga: nomeVaga
    })
  }

}
