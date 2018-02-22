import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { VagaService } from '../../providers/vaga-service';

//PAGES
import { PrincipalPage } from '../principal/principal';

//ENTITYS
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

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
  private loadingCidades = null;
  private estados = [];
  private cidades = [];

  languages = availableLanguages;
  private translate: TranslateService;
  private messagePresentToast: string;
  selectedLanguage = null;
  private _idioma: string;
  private vagaDetalheEntity: VagaDetalheEntity;

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
              translate: TranslateService) {

      this.translate = translate;
      this.vagaDetalheEntity = new VagaDetalheEntity();
      
    }

  ngOnInit() {
    
    this.getLanguage();

    this.criaVagaForm = this.formBuilder.group({
      'idEmpresa': ['', Validators.required],
      'idEstado': ['', Validators.required],
      'idCidade': ['', Validators.required],
      'nome': ['', [Validators.required, Validators.maxLength(100)]],
      'descricao': ['', [Validators.required, Validators.maxLength(500)]],
      'dataFinal': ['', Validators.required],
      'qtdVaga': ['', Validators.required],
      'salario': [''],
      'genero': ['', Validators.required],
      'grauEntendimento': ['', Validators.required],
      'grauFala': ['', Validators.required],
      'grauEscrita': ['', Validators.required],
    }
    );

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
    
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

  selecionaData() {
    this.datePicker.show({
      date: new Date(), 
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(dataServico => {
      this.dataServico = dataServico.toISOString();
    });
    
  }

  submeterVaga() {
    console.log(this.criaVagaForm.value);
    if (this.criaVagaForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: this.loading
      });
      this.loading.present();

      this.vagaService
      .criaVaga(this.vagaDetalheEntity)
      .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
        console.log(vagaDetalheEntityResult);

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
    } else {
        Object.keys(this.criaVagaForm.controls).forEach(campo => {
          const controle = this.criaVagaForm.get(campo);
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
      console.log(this.selectedLanguage);
      if (this.selectedLanguage == 'pt-br') {
        console.log('passou entro do if');
        this.loading = 'Aguarde...';
        this.messagePresentToast = 'A vaga foi inserida!';
        this.loadingCidades = 'Buscando cidades...';
      } else {
        this.loading = 'Wait...';
        this.messagePresentToast = 'The vacancy has been inserted!';
        this.loadingCidades = 'Searching cities...';
      }
    }
    this.translate.use(this.selectedLanguage);
  }

}
