import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,	FormGroup } from '@angular/forms';
import { Constants } from '../../app/constants';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { RamoEmpresaService } from '../../providers/ramo-empresa-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';
import { EmpresaEntity } from './../../model/empresa-entity';

//I18N
// import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-modal-filtro',
  templateUrl: 'modal-filtro.html',
})
export class ModalFiltroPage {

  public filtroForm: FormGroup;
  // languages = availableLanguages;
  // selectedLanguage: any;
  public languageDictionary: any;
  // private translate: TranslateService;
  private estados = [];
  private cidades = [];
  // private empresas;
  private loading: any;
  private loadingText: string;
  private loadingCidades = null;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private vagaDetalheEntity: VagaDetalheEntity;
  private empresaEntity: EmpresaEntity;
  private _idioma: string;
  private ramoEmpresa: any = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              // translate: TranslateService,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              // private vagaService: VagaService,
              private ramoEmpresaService: RamoEmpresaService,
              private languageTranslateService: LanguageTranslateService,
              public viewCtrl: ViewController) {

      // this.translate = translate;
      this.usuarioDetalheEntity = new UsuarioDetalheEntity();
      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.empresaEntity = new EmpresaEntity();

      this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ngOnInit() {
    // this.getLanguage();
    this.getTraducao();
    this.filtroForm = this.formBuilder.group({
      'idRamoEmpresa': [''],
      'idEstado': [''],
      'idCidade': [''],
      'idEmpresa': [''],
      'possuiCandidatosEnumFormat': ['']
    });
  }

  ionViewDidLoad() {
    this.vagaDetalheEntity.possuiCandidatosEnumFormat = 'TODOS';
  }

  getTraducao() {
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getRamoEmpresa() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.loadingText,
        dismissOnPageChange: true
      });
      this.loading.present();

      this.ramoEmpresaService.findAllRamoEmpresaAtivo()
        .then((ramoEntityResult) => {
          this.ramoEmpresa = ramoEntityResult;

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

  getCidadesByEstadoPopOver(idEstado) {
    try {

      this.loadingCidades = this.loadingCtrl.create({
        content: this.loadingCidades
      });
      this.loadingCidades.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;
          this.loadingCidades.dismiss();
        })
        .catch(err => {
          this.loadingCidades.dismiss();
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

  submeterFiltro() {
    if (this.filtroForm.valid) {
      this.viewCtrl.dismiss({
        filter: this.vagaDetalheEntity
      });

    } else {
      Object.keys(this.filtroForm.controls).forEach(campo => {
        const controle = this.filtroForm.get(campo);
        controle.markAsTouched();
      })
    }
  }

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
  //       if(!this.selectedLanguage){
  //         this.selectedLanguage = this._idioma;
  //       }
  //       else if(this.selectedLanguage) {
  //         this.selectedLanguage = this.selectedLanguage;
  //         if (this.selectedLanguage == 'pt-br') {
  //           this.loadingText = 'Aguarde...';
  //           this.loadingCidades = 'Buscando cidades...';
  //         } else {
  //           this.loadingText = 'Wait...';
  //           this.loadingCidades = 'Searching cities...';
  //         }
  //       }
  //       this.translate.use(this.selectedLanguage);
  //       this.getRamoEmpresa();
  // }

}
