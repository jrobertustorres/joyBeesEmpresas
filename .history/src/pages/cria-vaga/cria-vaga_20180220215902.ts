import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';

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
  private loadingDados = null;
  private loadingCidades = null;
  private estados = [];
  private cidades = [];

  languages = availableLanguages;
  private translate: TranslateService;
  private messagePresentToast: string;
  selectedLanguage = null;
  private _idioma: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private estadosService: EstadosService, 
    private cidadesService: CidadesService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    translate: TranslateService) {

      this.translate = translate;
    }

  ngOnInit() {
    
        this.getLanguage();
    
        this.criaVagaForm = this.formBuilder.group({
          'idEmpresa': ['', Validators.required],
          'idEstado': ['', Validators.required],
          'idCidade': ['', Validators.required],
          'nome': ['', [Validators.required, Validators.maxLength(100)]],
          'descricao': ['', [Validators.required, Validators.maxLength(100)]],
          'genero': ['', Validators.required],
          'idade': ['', Validators.required],
          'nacionalidade': ['', [Validators.required, Validators.maxLength(100)]],
          'experienciaProfissional': ['', [Validators.required, Validators.maxLength(500)]],
          'grauEntendimento': ['', Validators.required],
          'grauFala': ['', Validators.required],
          'grauEscrita': ['', Validators.required],
          'salario': [''],
          'endereco': ['', [Validators.required, Validators.maxLength(300)]],
          'telefonePessoa': ['', Validators.maxLength(50)],
          'telefonePessoa2': ['', Validators.maxLength(50)],
          'senhaUsuario': [''],
          'confirmSenha': ['']
          // 'statusAceitoTermoUso': ['false']
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
        this.messagePresentToast = 'Cadastro atualizado!';
        this.loadingCidades = 'Buscando cidades...';
        this.loadingDados = 'Buscando dados...';
      } else {
        this.loading = 'Wait...';
        this.messagePresentToast = 'Updated registration!';
        this.loadingCidades = 'Searching cities...';
        this.loadingDados = 'Searching data...';
      }
    }
    this.translate.use(this.selectedLanguage);
  }

}
