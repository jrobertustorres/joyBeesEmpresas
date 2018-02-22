import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Constants } from '../../app/constants';

import {DomSanitizer} from '@angular/platform-browser';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { UsuarioService } from '../../providers/usuario-service';
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { UsuarioDetalheVagaEntity } from '../../model/usuario-detalhe-vaga-entity';
import { UsuarioEntity } from '../../model/usuario-entity';

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
  private subTitleDescartarCandidatoVaga: string;
  private loading: any;
  private messagePresentToast: string;
  private messageDescartarCandidatoToast: string;
  private translate: TranslateService;
  private usuarioEntity: UsuarioEntity;
  private usuarioDetalheVagaEntity: UsuarioDetalheVagaEntity;
  public idVagaUsuario: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              private vagaService: VagaService,
              private sanitizer: DomSanitizer,
              private toastCtrl: ToastController,
              translate: TranslateService) {
    this.translate = translate;
    this.idVagaUsuario = navParams.get('idVagaUsuario');
    this.usuarioEntity = new UsuarioEntity();
    this.usuarioDetalheVagaEntity = new UsuarioDetalheVagaEntity();
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
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
        content: this.loadingDados
      });
      this.loading.present();

      this.usuarioEntity = new UsuarioEntity();
      this.usuarioEntity.idVagaUsuario = this.idVagaUsuario;

      this.usuarioService.getDetalheCandidato(this.usuarioEntity)
      .then((usuarioDetalheVagaEntityResult: UsuarioDetalheVagaEntity) => {
        this.usuarioDetalheVagaEntity = usuarioDetalheVagaEntityResult;
        this.loading.dismiss();

        // this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);

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

  verificaDescartarCandidatoVaga(idVagaUsuario) {
    // console.log(this.vagaDetalheEntity.isCandidatado);
    // if (this.vagaDetalheEntity.isCandidatado) {
      let alert = this.alertCtrl.create({
        subTitle: this.subTitleDescartarCandidatoVaga,
        buttons: [
          {
            text: this.manterCandidato,
            role: 'cancel',
          },
          {
            text: this.descartarCandidato,
            cssClass: 'btnDescartCss',
            handler: () => {
              this.descartarCandidatoVaga(idVagaUsuario);
            }
          }
        ]
      });
      alert.present();
      
    // } 
    // else {
    //   let alert = this.alertCtrl.create({
    //     subTitle: this.subTitleVaga,
    //     buttons: [
    //       {
    //         text: this.cancelar,
    //         role: 'cancel'
    //       },
    //       {
    //         text: this.candidatarText,
    //         cssClass: 'btnCandidatCss',
    //         handler: () => {
    //           this.candidatarVaga(idVaga);
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();
      
    // }
  }

  descartarCandidatoVaga(idVagaUsuario) {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingDados
      });
      this.loading.present();

      this.vagaService.descartarCandidatoVagaByFornecedor(idVagaUsuario)
        .then((usuarioDetalheVagaEntityResult: UsuarioDetalheVagaEntity) => {
          this.loading.dismiss();
          this.messagePresentToast = this.messageDescartarCandidatoToast;
          this.presentToast();
          setTimeout(() => {
            // this.navCtrl.setRoot(PrincipalPage);
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

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    } else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingDados = 'Aguarde...';
        this.manterCandidato = 'MANTER';
        this.descartarCandidato = 'DESCARTAR';
        this.subTitleDescartarCandidatoVaga = 'Deseja descartar este candidato?';
        this.messageDescartarCandidatoToast = 'Você não está mais candidatado à esta vaga!';
      } else {
        this.loadingDados = 'Wait...';
        this.manterCandidato = 'KEEP';
        this.descartarCandidato = 'DISCARD';
        this.subTitleDescartarCandidatoVaga = 'Do you want to discard this candidate?';
        this.messageDescartarCandidatoToast = 'Você não está mais candidatado à esta vaga!';
      }
    }
    this.getDetalheCandidatoVaga();
    this.translate.use(this.selectedLanguage);
  }

}
