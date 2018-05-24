import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-modal-filtro',
  templateUrl: 'modal-filtro.html',
})
export class ModalFiltroPage {

  public filtroForm: FormGroup;
  languages = availableLanguages;
  selectedLanguage: any;
  private translate: TranslateService;
  private estados = [];
  private cidades = [];
  private loading: any;
  private loadingText: string;
  private loadingCidades = null;
  private loadingEmpresas = null;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private vagaDetalheEntity: VagaDetalheEntity;
  private _idioma: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              private vagaService: VagaService,
              public viewCtrl: ViewController) {

      this.translate = translate;
      this.usuarioDetalheEntity = new UsuarioDetalheEntity();
      this.vagaDetalheEntity = new VagaDetalheEntity();

      this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ngOnInit() {
    this.getLanguage();
    this.filtroForm = this.formBuilder.group({
      'idEstado': [''],
      'idCidade': [''],
      'idEmpresa': [''],
    });
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
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

  getEmpresasList() {
    try {
      // this.loadingEmpresas = this.loadingCtrl.create({
      //   content: this.loadingEmpresas
      // });
      // this.loadingEmpresas.present();
      this.loading = this.loadingCtrl.create({
        content: this.loadingEmpresas
      });
      this.loading.present();

      this.vagaService.getEmpresas()
      .then((empresaEntityResult: EmpresaEntity) => {
        this.empresas = empresaEntityResult;

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
            this.loadingCidades = 'Buscando cidades...';
            this.loadingEmpresas = 'Buscando Empresas...';
          } else {
            this.loadingText = 'Wait...';
            this.loadingCidades = 'Searching cities...';
            this.loadingEmpresas = 'Searching Companys...';
          }
        }
        this.translate.use(this.selectedLanguage);
  }

}
