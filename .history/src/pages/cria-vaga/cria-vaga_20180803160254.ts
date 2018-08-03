import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';
import { MaskMoneyUtil } from "../../utilitarios/maskMoney";
import {ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { VagaService } from '../../providers/vaga-service';
import { RamoEmpresaService } from '../../providers/ramo-empresa-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

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
  @ViewChild(Content) content: Content;
  
  public criaVagaForm: FormGroup;
  private loading = null;
  private loadingText = null;
  private loadingCidades = null;
  private loadingEmpresas = null;
  private estados = [];
  private cidades = [];
  private ramoEmpresa: any = [];
  public dataFinal: string;
  public dataInicial: string;
  public dataFinalFormat: string;

  public languageDictionary: any;
  // public dataFinal: Date;
  // private empresas;

  private escondeSalarioMulher: boolean; 
  private escondeSalarioHomem: boolean; 

  private btnManterVaga: string; 
  private btnEncerrarVaga: string; 
  private titleEncerrarVaga: string; 
  private subTitleEncerrarVaga: string; 

  languages = availableLanguages;
  private translate: TranslateService;
  private messagePresentToast: string;
  private messagePresentToastInserida: string;
  private messagePresentToastAtualizada: string;
  private messagePresentToastReaberta: string;
  private messagePresentToastEncerrada: string;
  private criarVagaFormat: any;

  selectedLanguage = null;
  private _idioma: string;
  private vagaDetalheEntity: VagaDetalheEntity;
  private empresaEntity: EmpresaEntity;
  public idVaga: number;
  public telaVagasArquivadas: boolean;

  scrollToTop() {
    this.content.scrollToTop();
  }

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
              private maskMoney: MaskMoneyUtil,
              private ramoEmpresaService: RamoEmpresaService,
              private languageTranslateService: LanguageTranslateService,
              translate: TranslateService) {

      this.translate = translate;
      this.idVaga = navParams.get('idVaga');
      this.telaVagasArquivadas = navParams.get('telaVagasArquivadas');
      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.empresaEntity = new EmpresaEntity();
      
    }

  ngOnInit() {
    this.dataInicial = new Date().toISOString(); //TIRAR DEPOIS
    this.dataFinal = new Date().toISOString(); //TIRAR DEPOIS
    
    this.getTraducao();

    this.criaVagaForm = this.formBuilder.group({
      'idRamoEmpresa': ['', Validators.required],
      'idEstado': ['', Validators.required],
      'idCidade': ['', Validators.required],
      'nome': ['', [Validators.required, Validators.maxLength(100)]],
      'descricao': ['', [Validators.required, Validators.maxLength(500)]],
      'dataFinal': ['', Validators.required],
      'dataInicial': ['', Validators.required],
      // 'dataFinalFormat': ['', Validators.required],
      'qtdVaga': ['', Validators.required],
      'salarioHomem': [''],
      'salarioMulher': [''],
      'sexoEnum': ['', Validators.required],
      'grauEntendimentoEnum': ['', Validators.required],
      'grauFalaEnum': ['', Validators.required],
      'grauEscritaEnum': ['', Validators.required],
    });
    this.criaVagaForm.controls.idCidade.disable();

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
    
  }

  ionViewDidLoad() {
    this.vagaDetalheEntity.grauEntendimentoEnum = 'NENHUM';
    this.vagaDetalheEntity.grauFalaEnum = 'NENHUM';
    this.vagaDetalheEntity.grauEscritaEnum = 'NENHUM';
    this.vagaDetalheEntity.sexoEnum = 'AMBOS';
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        if (this.idVaga) {
          this.getDadosByIdVaga();
        } else {
          this.getRamoEmpresa();
        }
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

  getValorSalarioHomem(v) {
    this.vagaDetalheEntity.salarioHomem = this.maskMoney.maskConvert(v);
  }

  getValorSalarioMulher(v) {
    this.vagaDetalheEntity.salarioMulher = this.maskMoney.maskConvert(v);
  }

  getGenero(genero: any) {
    if(genero == 'AMBOS' || this.vagaDetalheEntity.sexoEnum == 'AMBOS') {
      this.escondeSalarioMulher = false;
      this.escondeSalarioHomem = false;
    }
    if(genero == 'MASCULINO' || this.vagaDetalheEntity.sexoEnum == 'MASCULINO') {
      this.escondeSalarioMulher = true;
      this.escondeSalarioHomem = false;
      this.vagaDetalheEntity.salarioMulher = null;
    } 
    if (genero == 'FEMININO' || this.vagaDetalheEntity.sexoEnum == 'FEMININO') {
      this.escondeSalarioMulher = false;
      this.escondeSalarioHomem = true;
      this.vagaDetalheEntity.salarioHomem = null;
    }

  }

  formataSalario() {
    if(this.vagaDetalheEntity.salarioHomem) {
      let salarioHomem: any = this.vagaDetalheEntity.salarioHomem;
      salarioHomem = parseFloat(salarioHomem).toFixed(2);
      salarioHomem = salarioHomem.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," );
      this.vagaDetalheEntity.salarioHomem = salarioHomem;
    }
    if(this.vagaDetalheEntity.salarioMulher) {
      let salarioMulher: any = this.vagaDetalheEntity.salarioMulher;
      salarioMulher = parseFloat(salarioMulher).toFixed(2);
      salarioMulher = salarioMulher.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," );
      this.vagaDetalheEntity.salarioMulher = salarioMulher;
    }
  }

  getDadosByIdVaga() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
        // dismissOnPageChange: true
      });
      this.loading.present();
      
      // this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity.idVaga = this.idVaga;
   
      this.vagaService.findVagaDetalhe(this.vagaDetalheEntity)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.vagaDetalheEntity = vagaDetalheEntityResult;
          this.dataInicial = new Date(this.vagaDetalheEntity.dataInicial).toJSON().split('T')[0];
          this.dataFinal = new Date(this.vagaDetalheEntity.dataFinal).toJSON().split('T')[0];

          this.getGenero(this.vagaDetalheEntity.sexoEnum);
          this.formataSalario();

          // this.vagaDetalheEntity.dataFinal = new Date(this.vagaDetalheEntity.dataFinal).toJSON().split('T')[0];
          // this.loading.dismiss();
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

  public selecionaDataInicial() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      okText: 'OK',
      cancelText: 'Cancelar',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(dataInicial => {
      // this.dataFinalFormat = dataFinal.toISOString();
      this.dataInicial = dataInicial.toISOString();
      
      // this.dataFinal = dataFinal;
    }, (err) => {
    });
  }

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
    });
  }

  submeterVaga() {

    if (this.criaVagaForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      if(!this.idVaga){
        this.insereVaga();
      }
      else if(this.idVaga) {
        this.editaVaga();
      }

    } else {
        Object.keys(this.criaVagaForm.controls).forEach(campo => {
          const controle = this.criaVagaForm.get(campo);
          controle.markAsTouched();
        })
      }
  }

  insereVaga() {
    // this.criaVagaForm.value.salarioHomem = this.criaVagaForm.value.salarioHomem.replace(",", "");
    // this.criaVagaForm.value.salarioMulher = this.criaVagaForm.value.salarioMulher.replace(",", "");
    this.criarVagaFormat = this.criaVagaForm;
    this.criarVagaFormat.value.salarioHomem = this.criaVagaForm.value.salarioHomem ? this.criaVagaForm.value.salarioHomem.replace(",", "") : null;
    this.criarVagaFormat.value.salarioMulher = this.criaVagaForm.value.salarioMulher ? this.criaVagaForm.value.salarioMulher.replace(",", "") : null;

    this.vagaService
    .criaVaga(this.criarVagaFormat.value)
    .then((vagaDetalheEntityResult: VagaDetalheEntity) => {

      this.loading.dismiss();
      this.messagePresentToast = this.languageDictionary.TOAST_VAGA_INSERIDA;
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

  // ESTA DESABILITADO. POR ENQUANTO NÃO VAMOS DEIXAR ATUALIZAR A VAGA
  editaVaga() {
    // this.scrollToTop();
    this.criarVagaFormat = this.vagaDetalheEntity;
    this.criarVagaFormat.salarioHomem = this.criaVagaForm.value.salarioHomem ? this.criaVagaForm.value.salarioHomem.replace(",", "") : null;
    this.criarVagaFormat.salarioMulher = this.criaVagaForm.value.salarioMulher ? this.criaVagaForm.value.salarioMulher.replace(",", "") : null;

    this.vagaService
    .alteraVaga(this.criarVagaFormat) //this.criaVagaForm.value
    .then((vagaDetalheEntityResult: VagaDetalheEntity) => {

      this.loading.dismiss();
      this.messagePresentToast = this.languageDictionary.TOAST_VAGA_ATUALIZADA;
      this.presentToast();
      setTimeout(() => {
        // this.scrollToTop();
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

  encerrarVaga(idVaga) {
    this.vagaService
    .fecharVaga(idVaga)
    .then((vagaDetalheEntityResult: VagaDetalheEntity) => {

      this.loading.dismiss();
      this.messagePresentToast = this.languageDictionary.TOAST_VAGA_ENCERRADA;
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

  showConfirmEncerrarVaga(idVaga) {
    const confirm = this.alertCtrl.create({
      title: this.titleEncerrarVaga,
      message: this.subTitleEncerrarVaga,
      buttons: [
        {
          text: this.languageDictionary.BTN_MANTER,
          handler: () => {
          }
        },
        {
          text: this.languageDictionary.BTN_ENCERRAR,
          handler: () => {
            this.encerrarVaga(idVaga);
          }
        }
      ]
    });
    confirm.present();
  }

  getRamoEmpresa() {
    try {

      if (!this.idVaga) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
        // dismissOnPageChange: true
        });
        this.loading.present();
      }

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

  getCidadesByEstadoUsuario(idEstado) {
    try {
      // this.loadingCidades = this.loadingCtrl.create({
      //   content: this.loadingCidades
      // });
      // this.loadingCidades.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;
          this.criaVagaForm.controls.idCidade.enable();
          // this.loading.dismiss();
          this.getRamoEmpresa();
        })
        .catch(err => {
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

  duplicarVaga() {
    this.vagaDetalheEntity.salarioHomem = this.criaVagaForm.value.salarioHomem.replace(",", "");
    this.vagaDetalheEntity.salarioMulher = this.criaVagaForm.value.salarioMulher.replace(",", "");

    if (this.criaVagaForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      // this.vagaDetalheEntity = this.criaVagaForm.value;
      this.vagaService
      .duplicarVaga(this.vagaDetalheEntity)
      .then((vagaDetalheEntityResult: VagaDetalheEntity) => {

        this.loading.dismiss();
        this.messagePresentToast = this.languageDictionary.TOAST_VAGA_REABERTA;
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

    } else {
        Object.keys(this.criaVagaForm.controls).forEach(campo => {
          const controle = this.criaVagaForm.get(campo);
          controle.markAsTouched();
        })
      }

  }

  // getEmpresasList() {
  //   try {
  //     // this.loadingEmpresas = this.loadingCtrl.create({
  //     //   content: this.loadingEmpresas
  //     // });
  //     // this.loadingEmpresas.present();
  //     this.loading = this.loadingCtrl.create({
  //       content: this.loadingText
  //     });
  //     this.loading.present();

  //     this.vagaService.getEmpresas()
  //     .then((empresaEntityResult: EmpresaEntity) => {
  //       this.empresas = empresaEntityResult;
  //       if(this.idVaga) {
  //         this.getDadosByIdVaga();
  //       } else {
  //         this.loading.dismiss();
  //       } 

  //       // this.loading.dismiss();
  //   }, (err) => {
  //     this.loading.dismiss();
  //     this.alertCtrl.create({
  //       subTitle: err.message,
  //       buttons: ['OK']
  //     }).present();
  //   });

  //     // this.vagaService
  //     //   .getEmpresas()
  //     //   .then((listEmpresasResult) => {
  //     //     this.empresas = listEmpresasResult;
  //     //     console.log(this.empresas);
  //     //     this.loadingEmpresas.dismiss();
  //     //   })
  //     //   .catch(err => {
  //     //     this.loadingEmpresas.dismiss();
  //     //     this.alertCtrl.create({
  //     //       subTitle: err.message,
  //     //       buttons: ['OK']
  //     //     }).present();
  //     //   });
  //   }catch (err){
  //     if(err instanceof RangeError){
  //     }
  //     console.log(err);
  //   }
  // }

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
  //   if(!this.selectedLanguage){
  //     this.selectedLanguage = this._idioma;
  //   }
  //   else if(this.selectedLanguage) {
  //     if (this.selectedLanguage == 'pt-br') {
  //       this.loadingText = 'Aguarde...';
  //       this.messagePresentToastInserida = 'A vaga foi inserida!';
  //       this.messagePresentToastAtualizada = 'A vaga foi atualizada!';
  //       this.messagePresentToastReaberta = 'A vaga foi reaberta!';
  //       this.messagePresentToastEncerrada = 'A vaga foi encerrada!';
  //       this.loadingCidades = 'Buscando cidades...';
  //       this.loadingEmpresas = 'Buscando Empresas...';
  //       this.btnManterVaga = 'MANTER';
  //       this.btnEncerrarVaga = 'ENCERRAR';
  //       this.titleEncerrarVaga = 'Encerrar vaga';
  //       this.subTitleEncerrarVaga = 'Deseja encerrar esta vaga?';
  //     } else {
  //       this.loadingText = 'Wait...';
  //       // this.messagePresentToast = 'The vacancy has been inserted!';
  //       this.messagePresentToastInserida = 'The vacancy has been inserted!';
  //       this.messagePresentToastAtualizada = 'The vacancy has been updated!';
  //       this.messagePresentToastReaberta = 'The vacancy has been restart';
  //       this.messagePresentToastEncerrada = 'The vacancy has been closed';
  //       this.loadingCidades = 'Searching cities...';
  //       this.loadingEmpresas = 'Searching Company...';
  //       this.btnManterVaga = 'KEEP';
  //       this.btnEncerrarVaga = 'CLOSE';
  //       this.titleEncerrarVaga = 'Close vacancy';
  //       this.subTitleEncerrarVaga = 'Do you want to close this vacancy?';
  //     }
  //   }
  //   this.translate.use(this.selectedLanguage);
  //   // this.getDadosByIdVaga();
  // }

}
