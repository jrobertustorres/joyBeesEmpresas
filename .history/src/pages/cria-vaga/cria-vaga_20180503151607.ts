import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { VagaService } from '../../providers/vaga-service';

//PAGES
import { PrincipalPage } from '../principal/principal';

//ENTITYS
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';
import { EmpresaEntity } from './../../model/empresa-entity';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-cria-vaga',
  templateUrl: 'cria-vaga.html',
})
export class CriaVagaPage {
  public criaVagaForm: FormGroup;
  private loading = null;
  private loadingText = null;
  private loadingCidades = null;
  private loadingEmpresas = null;
  private estados = [];
  private cidades = [];
  // private empresas = [];
  public dataFinal: string;
  public dataFinalFormat: string;
  // public dataFinal: Date;
  private empresas;

  languages = availableLanguages;
  private translate: TranslateService;
  private messagePresentToast: string;
  selectedLanguage = null;
  private _idioma: string;
  private vagaDetalheEntity: VagaDetalheEntity;
  private empresaEntity: EmpresaEntity;
  public idVaga: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private estadosService: EstadosService, 
              private cidadesService: CidadesService,
              private vagaService: VagaService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private datePicker: DatePicker,
              translate: TranslateService) {

      this.translate = translate;
      this.idVaga = navParams.get('idVaga');
      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.empresaEntity = new EmpresaEntity();
      
    }

  ngOnInit() {
    
    this.getLanguage();
    this.getEmpresasList();

    this.criaVagaForm = this.formBuilder.group({
      'idEstado': ['', Validators.required],
      'idCidade': ['', Validators.required],
      'nome': ['', [Validators.required, Validators.maxLength(100)]],
      'descricao': ['', [Validators.required, Validators.maxLength(500)]],
      'dataFinal': ['', Validators.required],
      // 'dataFinalFormat': ['', Validators.required],
      'qtdVaga': ['', Validators.required],
      'salarioHomem': [''],
      'salarioMulher': [''],
      'sexoEnum': ['', Validators.required],
      'grauEntendimentoEnum': ['', Validators.required],
      'grauFalaEnum': ['', Validators.required],
      'grauEscritaEnum': ['', Validators.required],
    }
    );

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
    
    // if(this.idVaga) {
    //   this.getDadosByIdVaga();
    // }
    
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

  // selecionaData() {

  //   this.datePicker.show({
  //     date: new Date(), 
  //     mode: 'date'
  //   })
  //   .then(data => this.agendamento.data = data.toISOString());

  // }

  public selecionaDataFinal() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      okText: 'OK',
      cancelText: 'Cancelar',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(dataFinal => {
      // this.dataFinalFormat = dataFinal.toISOString();
      this.dataFinal = dataFinal.toISOString();
      
      // this.dataFinal = dataFinal;
    }, (err) => {
      console.log('Error occurred while getting date: ', err);
      console.log('---------------------------------------- ', err);
    });
  }

  // selecionaDataFinal() {
  //   this.datePicker.show({
  //     date: new Date(), 
  //     mode: 'date',
  //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //   })
  //   .then(dataFinal => {
  //     this.dataFinal = dataFinal.toISOString();
  //   });
    
  // }

  submeterVaga() {

    if (this.criaVagaForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      if(!this.idVaga){
        this.insereVaga();
      }
      else if(this.idVaga) {
        this.editaVaga();
      }

      // this.vagaService
      // .criaVaga(this.vagaDetalheEntity)
      // .then((vagaDetalheEntityResult: VagaDetalheEntity) => {

      //   this.loading.dismiss();
      //   this.presentToast();
      //   setTimeout(() => {
      //     this.navCtrl.setRoot(PrincipalPage);
      //   }, 3000);
      // }, (err) => {
      //   this.loading.dismiss();
      //   this.alertCtrl.create({
      //     subTitle: err.message,
      //     buttons: ['OK']
      //   }).present();
      // });

    } else {
        Object.keys(this.criaVagaForm.controls).forEach(campo => {
          const controle = this.criaVagaForm.get(campo);
          controle.markAsTouched();
        })
      }

  }

  insereVaga() {
    this.vagaService
    // .criaVaga(this.vagaDetalheEntity)
    .criaVaga(this.criaVagaForm.value)
    .then((vagaDetalheEntityResult: VagaDetalheEntity) => {

      this.loading.dismiss();
      this.presentToast();
      setTimeout(() => {
        this.navCtrl.setRoot(PrincipalPage);
      }, 3000);
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  editaVaga() {
    console.log(this.vagaDetalheEntity);
    this.vagaService
    .alteraVaga(this.vagaDetalheEntity) //this.criaVagaForm.value
    .then((vagaDetalheEntityResult: VagaDetalheEntity) => {

      this.loading.dismiss();
      this.presentToast();
      setTimeout(() => {
        this.navCtrl.setRoot(PrincipalPage);
      }, 3000);
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  getDadosByIdVaga() {
    try {
      
      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity.idVaga = this.idVaga;
   
      this.vagaService.findVagaDetalhe(this.vagaDetalheEntity)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.vagaDetalheEntity = vagaDetalheEntityResult;
          this.vagaDetalheEntity.dataFinal = new Date(this.vagaDetalheEntity.dataFinal).toJSON().split('T')[0];
          this.loading.dismiss();
          this.getCidadesByEstadoUsuario(vagaDetalheEntityResult.idEstado);
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

  getCidadesByEstadoUsuario(idEstado) {
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
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.getEmpresas()
      .then((empresaEntityResult: EmpresaEntity) => {
        this.empresas = empresaEntityResult;
        if(this.idVaga) {
          this.getDadosByIdVaga();
        } else {
          this.loading.dismiss();
        } 

        // this.loading.dismiss();
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

      // this.vagaService
      //   .getEmpresas()
      //   .then((listEmpresasResult) => {
      //     this.empresas = listEmpresasResult;
      //     console.log(this.empresas);
      //     this.loadingEmpresas.dismiss();
      //   })
      //   .catch(err => {
      //     this.loadingEmpresas.dismiss();
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
    }
    else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Aguarde...';
        this.messagePresentToast = 'A vaga foi inserida!';
        this.loadingCidades = 'Buscando cidades...';
        this.loadingEmpresas = 'Buscando Empresas...';
      } else {
        this.loadingText = 'Wait...';
        this.messagePresentToast = 'The vacancy has been inserted!';
        this.loadingCidades = 'Searching cities...';
        this.loadingEmpresas = 'Searching Company...';
      }
    }
    this.translate.use(this.selectedLanguage);
  }

}
