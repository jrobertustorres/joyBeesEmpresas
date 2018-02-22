import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ModalController } from 'ionic-angular';
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
import { CriaVagaPage } from './../cria-vaga/cria-vaga';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro';
// import { DetalheVagaPage } from '../detalhe-vaga/detalhe-vaga';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  segment: string = "vagasAtivas"; // default button

  languages = availableLanguages;
  private selectedLanguage = null;
  private translate: TranslateService;
  private vagasAtivas;
  private vagas;
  private loadingText: string;
  private loading = null;
  private loadingDestaques = null;
  private vagaDetalheEntity: VagaDetalheEntity;
  private _idioma: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController) {

    this.translate = translate;
    
    this.vagaDetalheEntity = new VagaDetalheEntity();

  }

  ngOnInit() {
    this.getLanguage();
    // this.getVagasAtivas(this.vagaDetalheEntity);
  }

  ionViewDidLoad() {
  }

  // doRefreshDestaques(refresher) {
  //   this.getVagasDestaquePrincipal();

  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  // }

  // doRefreshVagasCidade(refresher) {
  //   this.vagaDetalheEntity = new VagaDetalheEntity();
  //   this.getVagasPrincipal(this.vagaDetalheEntity);

  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  // }

  selectedTabChanged($event): void {
    if ($event._value == "vagasAtivas") {
        this.getVagasAtivas(this.vagaDetalheEntity);
      } else {
          // this.getVagasArquivadas();
    }
  }

  openModalFiltro(){
    let modal = this.modalCtrl.create(ModalFiltroPage);

    modal.onDidDismiss((data) => {
      if (data) {
        this.segment = "vagasAtivas";
        this.getVagasAtivas(data.filter);
      }
    });

    modal.present();
  }

  // getVagasArquivadas() {
  //   try {
  //     this.loadingDestaques = this.loadingCtrl.create({
  //       content: this.loadingText
  //     });
  //     this.loadingDestaques.present();

  //     this.vagaService.getVagasHome()
  //       .then((vagasListaEntityResult: VagaListaEntity) => {
  //         this.vagasAtivas = vagasListaEntityResult;

  //         console.log(this.vagasAtivas);
  //         this.loadingDestaques.dismiss();
  //     }, (err) => {
  //       this.loadingDestaques.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });
  //   }
  //   catch (err){
  //     if(err instanceof RangeError){
  //       console.log('out of range');
  //     }
  //     console.log(err);
  //   }
  // }

  getVagasAtivas(filtro) {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity = filtro;

      this.vagaService.findVagaFornecedorByVaga(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagasAtivas = vagasListaEntityResult;
          console.log(this.vagasAtivas);

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

  goTelaCriarVaga() {
    this.navCtrl.push(CriaVagaPage);
  }

  // detalheVaga(idVaga) {
  //   this.navCtrl.push(DetalheVagaPage, {
  //     idVaga: idVaga
  //   })
  // }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    // this._storage.get('selectedLanguage').then((selectedLanguage) => {
      console.log(this.selectedLanguage);
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
