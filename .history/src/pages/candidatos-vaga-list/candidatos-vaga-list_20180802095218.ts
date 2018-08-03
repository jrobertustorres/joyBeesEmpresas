import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//PAGES
import { DetalheCandidatoVagaPage } from '../detalhe-candidato-vaga/detalhe-candidato-vaga';


@IonicPage()
@Component({
  selector: 'page-candidatos-vaga-list',
  templateUrl: 'candidatos-vaga-list.html',
})
export class CandidatosVagaListPage {
  segment: string = "candidatosList"; // default button
  public idVaga: number;
  public qtdUsuariosVaga: number;
  public qtdFinalistaVaga: number;
  private nomeVaga: string;
  private vagas;
  private finalistasVagas;
  languages = availableLanguages;
  private selectedLanguage = null;
  private translate: TranslateService;
  private _idioma: string;
  private loadingText: string;
  private loading = null;
  private vagaDetalheEntity: VagaDetalheEntity;
  private refresh: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              translate: TranslateService) {

    this.translate = translate;
    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.idVaga = navParams.get('idVaga');
    this.nomeVaga = navParams.get('nomeVaga');
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.getCandidatosVaga();
      infiniteScroll.complete();
    }, 500);
  }

  doRefreshCandidatosVaga(refresher) {
    // this.refresh = true;
    this.getCandidatosVaga();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  selectedTabChanged($event): void {
    if ($event._value == "candidatosList") {
        this.getCandidatosVaga();
        this.refresh = true;
      } else {
        this.getFinalistasVaga();
        this.refresh = false;
    }
  }

  getCandidatosVaga() {
    try {
      this.vagaDetalheEntity.limiteDados = this.vagaDetalheEntity.limiteDados ? this.vagas.length : null;
      this.vagaDetalheEntity.idVaga = this.idVaga;

      // if(this.vagaDetalheEntity.limiteDados == null) {
      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.loadingText
        });
        this.loading.present();
      }

      this.vagaService.findUsuarioByIdVaga(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          this.vagaDetalheEntity.limiteDados = this.vagas.length;

          if (this.vagas.length > 0) {
            this.qtdUsuariosVaga = this.vagas[0].qtdUsuariosVaga;
          }
          this.refresh = true;
          this.loading ? this.loading.dismiss() : '';
      }, (err) => {
        // this.loading.dismiss();
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

  getFinalistasVaga() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      // this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity.idVaga = this.idVaga;

      this.vagaService.findFavoritosVaga(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.finalistasVagas = vagasListaEntityResult;
          if (this.vagas.length > 0) {
            this.qtdFinalistaVaga = this.vagas[0].qtdUsuarioFinalistasVaga;
            this.nomeVaga = this.vagas[0].nomeVaga;
          }
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

  callDetalheCandidatoVaga(idVagaUsuario) {
    this.navCtrl.push(DetalheCandidatoVagaPage, {
      idVagaUsuario: idVagaUsuario
    })
  }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          this.selectedLanguage = this.selectedLanguage;
          if (this.selectedLanguage == 'pt-br') {
            this.loadingText = 'Aguarde...';
          } else {
            this.loadingText = 'Wait...';
          }
        }
        this.getCandidatosVaga();
        this.translate.use(this.selectedLanguage);

  }

}
