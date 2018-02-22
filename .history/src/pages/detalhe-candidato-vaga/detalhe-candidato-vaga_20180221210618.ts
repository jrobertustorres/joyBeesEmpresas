import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { UsuarioService } from '../../providers/usuario-service';

//ENTITYS
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';


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
  private loading: any;
  private translate: TranslateService;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  public idVagaUsuario: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              translate: TranslateService) {
    this.translate = translate;
    this.idVagaUsuario = navParams.get('idVagaUsuario');
    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
  }

  getDetalheCandidatoVaga() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.loadingDados
      });
      this.loading.present();

      this.usuarioService.getDetalheCandidato(this.idVagaUsuario)
      .then((UsuarioDetalheVagaEntityResult: UsuarioDetalheVagaEntity) => {
        this.usuarioDetalheVagaEntity = UsuarioDetalheVagaEntityResult;
        console.log(this.usuarioDetalheVagaEntity);
        this.loading.dismiss();

        // this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);

    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

      // this.usuarioService
      //   .getDetalheCandidato(this.idVagaUsuario)
      //   .then((dadosUsuarioDetalheResult) => {
      //     this.usuarioDetalheEntity = dadosUsuarioDetalheResult;
      //     console.log(this.usuarioDetalheEntity);

      //     this.loading.dismiss();
      //     // this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);
      //   })
      //   .catch(err => {
      //     this.loading.dismiss();
      //     this.alertCtrl.create({
      //       subTitle: err.message,
      //       buttons: ['OK']
      //     }).present();
      //   });
    }catch (err){
      if(err instanceof RangeError){
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
      } else {
        this.loadingDados = 'Wait...';
      }
    }
    this.getDetalheCandidatoVaga();
    this.translate.use(this.selectedLanguage);
  }

}
