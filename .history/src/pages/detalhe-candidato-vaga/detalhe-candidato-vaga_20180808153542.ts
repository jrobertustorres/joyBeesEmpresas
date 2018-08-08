import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Constants } from '../../app/constants';

import { DomSanitizer } from '@angular/platform-browser';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { UsuarioService } from '../../providers/usuario-service';
import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { UsuarioDetalheVagaEntity } from '../../model/usuario-detalhe-vaga-entity';
import { UsuarioEntity } from '../../model/usuario-entity';
import { VagaListaEntity } from '../../model/vaga-lista-entity';

//PAGES
import { PrincipalPage } from '../principal/principal';

@IonicPage()
@Component({
  selector: 'page-detalhe-candidato-vaga',
  templateUrl: 'detalhe-candidato-vaga.html',
})
export class DetalheCandidatoVagaPage {
  languages = availableLanguages;
  selectedLanguage: any;
  private _idioma: string;
  private loadingDados: string;
  private manterCandidato: string;
  private descartarCandidato: string;
  private finalistaCandidato: string;
  private subTitleDescartarCandidatoVaga: string;
  private subTitleFavoritarCandidatoVaga: string;
  private loading: any;
  private messagePresentToast: string;
  private messageDescartarCandidatoToast: string;
  private messageFinalistaCandidatoToast: string;
  private btnCancelar: string;
  private translate: TranslateService;
  private usuarioEntity: UsuarioEntity;
  private vagaListaEntity: VagaListaEntity;
  private usuarioDetalheVagaEntity: UsuarioDetalheVagaEntity;
  public idVagaUsuario: number;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              private vagaService: VagaService,
              private sanitizer: DomSanitizer,
              private toastCtrl: ToastController,
              private languageTranslateService: LanguageTranslateService,
              translate: TranslateService) {
    this.translate = translate;
    this.idVagaUsuario = navParams.get('idVagaUsuario');
    this.usuarioEntity = new UsuarioEntity();
    this.vagaListaEntity = new VagaListaEntity();
    this.usuarioDetalheVagaEntity = new UsuarioDetalheVagaEntity();
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
        this.getDetalheCandidatoVaga();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.messagePresentToast,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getDetalheCandidatoVaga() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.usuarioEntity.idVagaUsuario = this.idVagaUsuario;

      this.usuarioService.getDetalheCandidato(this.usuarioEntity)
      .then((usuarioDetalheVagaEntityResult: UsuarioDetalheVagaEntity) => {
        this.usuarioDetalheVagaEntity = usuarioDetalheVagaEntityResult;

        this.usuarioDetalheVagaEntity.nacionalidade = this.usuarioDetalheVagaEntity.nacionalidade.charAt(0).toUpperCase() + this.usuarioDetalheVagaEntity.nacionalidade.slice(1).toLowerCase();
        this.usuarioDetalheVagaEntity.genero = this.usuarioDetalheVagaEntity.genero.charAt(0).toUpperCase() + this.usuarioDetalheVagaEntity.genero.slice(1).toLowerCase();
        this.usuarioDetalheVagaEntity.grauEntendimento = this.usuarioDetalheVagaEntity.grauEntendimento.charAt(0).toUpperCase() + this.usuarioDetalheVagaEntity.grauEntendimento.slice(1).toLowerCase();
        this.usuarioDetalheVagaEntity.grauFala = this.usuarioDetalheVagaEntity.grauFala.charAt(0).toUpperCase() + this.usuarioDetalheVagaEntity.grauFala.slice(1).toLowerCase();
        this.usuarioDetalheVagaEntity.grauEscrita = this.usuarioDetalheVagaEntity.grauEscrita.charAt(0).toUpperCase() + this.usuarioDetalheVagaEntity.grauEscrita.slice(1).toLowerCase();

        this.loading.dismiss();

    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }

  }

  verificaDescartarCandidatoVaga() {
      let alert = this.alertCtrl.create({
        subTitle: this.languageDictionary.SUBTITLE_DESCARTAR_CANDIDATO,
        buttons: [
          {
            text: this.languageDictionary.BTN_MANTER,
            role: 'cancel',
          },
          {
            text: this.languageDictionary.BTN_DESCARTAR,
            cssClass: 'btnDescartCss',
            handler: () => {
              this.descartarCandidatoVaga();
            }
          }
        ]
      });
      alert.present();
  }

  verificaFavoritarCandidatoVaga() {
      let alert = this.alertCtrl.create({
        subTitle: this.languageDictionary.SUBTITLE_FAVORITAR_CANDIDATO,
        buttons: [
          {
            text: this.languageDictionary.BTN_MANTER,
            role: 'cancel',
          },
          {
            text: this.languageDictionary.BTN_FINALISTA,
            cssClass: 'btnFinalistatCss',
            handler: () => {
              this.setFinalistaCandidatoVaga();
            }
          }
        ]
      });
      alert.present();
  }

  descartarCandidatoVaga() {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.vagaService.descartarCandidatoVagaByFornecedor(this.idVagaUsuario)
      .then((usuarioDetalheVagaEntityResult: UsuarioDetalheVagaEntity) => {
          this.loading.dismiss();
          this.messagePresentToast = this.messageDescartarCandidatoToast;
          this.presentToast();
          setTimeout(() => {
            this.navCtrl.setRoot(PrincipalPage);
            // this.navCtrl.push(CandidatosVagaListPage);
          }, 3000);
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

  setFinalistaCandidatoVaga() {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.vagaService.setFinalistaCandidatoVagaByFornecedor(this.idVagaUsuario)
        .then((vagaListaEntityResult: VagaListaEntity) => {
          this.loading.dismiss();
          this.messagePresentToast = this.messageFinalistaCandidatoToast;
          this.presentToast();
          setTimeout(() => {
            this.navCtrl.setRoot(PrincipalPage);
            // this.navCtrl.push(CandidatosVagaListPage);
          }, 3000);
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

}
