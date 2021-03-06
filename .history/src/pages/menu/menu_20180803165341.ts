import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Platform, ActionSheetController } from 'ionic-angular';

// import { Storage } from '@ionic/storage';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';

//PAGES
import { HomePage } from '../home/home';
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { VagasArquivadasListPage } from '../vagas-arquivadas-list/vagas-arquivadas-list';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { LoginService } from '../../providers/login-service';
import { UsuarioService } from '../../providers/usuario-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit{
  @ViewChild('content') nav: Nav;
  rootPage:any;
  public nomeFornecedor: string;
  public nomePessoa: string;
  public loginPessoa: string;
  pages: Array<{title: string, component: any, isVisible: boolean, icon: string}>;

  languages = availableLanguages;
  selectedLanguage: any;
  private translate: TranslateService;
  private usuarioEntity: UsuarioEntity;
  public languageDictionary: any;

  private subTitleLogout: string;
  private cancelLogout: string;
  private sairLogout: string;
  private configuracoes: string;
  private minhasVagas: string;
  private vagasArquivadas: string;
  private loadingText: string;
  private candidaturas: string;
  private loading = null;
  private alterarFoto: string;
  private abrirCamera: string;
  private abrirGaleria: string;
  private cancelar: string;

  cameraData: any;
  photoTaken: boolean;
  cameraUrl: any;
  photoSelected: boolean;
  private _idioma: string;

  constructor(public navParams: NavParams,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              translate: TranslateService,
              private languageProvider: LanguageProvider,
              public loginService: LoginService,
              public usuarioService: UsuarioService,
              public platform: Platform,
              private languageTranslateService: LanguageTranslateService,
              public actionSheetCtrl: ActionSheetController) {

      this.usuarioEntity = new UsuarioEntity();

      // this.translate = translate;

      // try {

      //   if(!localStorage.getItem(Constants.ID_USUARIO)){
      //     this.rootPage = HomePage;
      //   }
      //   else if(localStorage.getItem(Constants.ID_USUARIO)) {
      //     this.callLoginByIdService(localStorage.getItem(Constants.ID_USUARIO));
      //   }
      // }
      // catch (err){
      // }
  }

  ngOnInit() {
    // this.getLanguage();
    this.getTraducao();
    // this.constroiMenu();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.verificaIdUsuario();

      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  getTraducaoEmited() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        if(localStorage.getItem(Constants.ID_USUARIO)) {
          this.constroiMenu();
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

  verificaIdUsuario() {
    if(!localStorage.getItem(Constants.ID_USUARIO)){
      this.rootPage = HomePage;
    }
    else if(localStorage.getItem(Constants.ID_USUARIO)) {
      this.callLoginByIdService(localStorage.getItem(Constants.ID_USUARIO));
    }
  }

  constroiMenu() {

    this.pages = [
      { title: this.languageDictionary.VAGAS_MENU, component: PrincipalPage, isVisible: true, icon: 'ios-search' },
      { title: this.languageDictionary.VAGAS_ARQUIVADAS, component: VagasArquivadasListPage, isVisible: true, icon: 'ios-folder-open' },
      { title: this.languageDictionary.CONFIGURACOES, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
    ];

    // this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
    //   this.selectedLanguage = selectedLanguage;
    //   localStorage.setItem(Constants.IDIOMA_USUARIO, selectedLanguage);
    //   this.getLanguage(); // aqui temos a chamar novamente para funcionar a altera????o da linguagem
    // });

    // this.loginService.nomeFornecedorChangeEvent.subscribe(nomeFornecedor => {
    //   this.nomeFornecedor = nomeFornecedor;
    // });
    // this.loginService.userChangeEvent.subscribe(nomePessoa => {
    //   this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
    // });
    // this.loginService.emailPessoaChangeEvent.subscribe(login => {
    //   this.loginPessoa = login.split(/(\s).+\s/).join("");
    // });

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  callLoginByIdService(idUsuario) {
  
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.usuarioEntity.idUsuario = idUsuario;
      this.loginService.loginByIdService(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {
          this.rootPage = PrincipalPage;
          this.loading.dismiss();

      }, (err) => {
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

  logout() {
    let alert = this.alertCtrl.create({
      subTitle: this.languageDictionary.SUBTITLE_SAIR,
      buttons: [
        {
          text: this.languageDictionary.BTN_FICAR,
          role: 'cancel'
        },
        {
          text: this.languageDictionary.SAIR_UPPER,
          handler: () => {
            // this._storage.remove(Constants.ID_USUARIO);
            // this._storage.remove(Constants.TOKEN_USUARIO);
            // this._storage.remove(Constants.NOME_PESSOA);
            // this._storage.remove(Constants.IDIOMA_USUARIO);
            // localStorage.removeItem(Constants.IDIOMA_USUARIO);
            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            localStorage.removeItem(Constants.IDIOMA_USUARIO);
            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    } else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Aguarde...';
        this.subTitleLogout = 'Deseja realmente sair?';
        this.cancelLogout = 'FICAR';
        this.sairLogout = 'SAIR';
        this.minhasVagas = 'Vagas';
        this.vagasArquivadas = 'Vagas arquivadas';
        this.configuracoes = 'Configura????es';
        this.candidaturas = 'Candidaturas';
        this.alterarFoto = 'Alterar foto';
        this.abrirCamera = 'Abrir c??mera';
        this.abrirGaleria = 'Abrir galeria';
        this.cancelar = 'Cancelar';
      } else {
        this.loadingText = 'Wait...';
        this.subTitleLogout = 'Are you sure you want to log out?';
        this.cancelLogout = 'STAY';
        this.sairLogout = 'LOG OUT';
        this.minhasVagas = 'Vacancies';
        this.vagasArquivadas = 'Archived Jobs';
        this.configuracoes = 'Settings';
        this.candidaturas = 'Applications';
        this.alterarFoto = 'Change photo';
        this.abrirCamera = 'Open camera';
        this.abrirGaleria = 'Open Gallery';
        this.cancelar = 'Cancel';
      }
      this.pages = [
        { title: this.minhasVagas, component: PrincipalPage, isVisible: true, icon: 'ios-search' },
        { title: this.vagasArquivadas, component: VagasArquivadasListPage, isVisible: true, icon: 'ios-folder-open' },
        { title: this.configuracoes, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
      ];
    }
    this.translate.use(this.selectedLanguage);

  }

}
