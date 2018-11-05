import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Platform, ActionSheetController } from 'ionic-angular';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';
import { VersaoAppEntity } from '../../model/versao-app-entity';

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
import { VersaoAppService } from '../../providers/versao-app-service';

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
  private versaoAppEntity: VersaoAppEntity;

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
  private versao: any;

  constructor(public navParams: NavParams,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              translate: TranslateService,
              private languageProvider: LanguageProvider,
              public loginService: LoginService,
              public usuarioService: UsuarioService,
              public platform: Platform,
              private versaoAppService: VersaoAppService,
              private languageTranslateService: LanguageTranslateService,
              public actionSheetCtrl: ActionSheetController) {

      this.usuarioEntity = new UsuarioEntity();
      this.versaoAppEntity = new VersaoAppEntity();

  }

  ngOnInit() {
    this.loginService.nomeFornecedorChangeEvent.subscribe(nomeFornecedor => {
      this.nomeFornecedor = nomeFornecedor;
    });
    this.loginService.userChangeEvent.subscribe(nomePessoa => {
      this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
    });
    this.loginService.emailPessoaChangeEvent.subscribe(login => {
      this.loginPessoa = login.split(/(\s).+\s/).join("");
    });

    this.getTraducao();

    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
      this.getTraducaoEmited(); // aqui temos que chamar novamente para funcionar a alteração da linguagem no menu
    });
    this.loginService.languageChangeEvent.subscribe(selectedLanguage => {
      this.getTraducaoEmited(); // aqui temos que chamar novamente para funcionar a alteração da linguagem no menu
    });
  }

  ionViewDidLoad() {
  }  

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getAtualizacaoStatus();
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

  getAtualizacaoStatus() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT_AUT,
      });
      this.loading.present();

      this.versaoAppEntity.versao = localStorage.getItem(Constants.VERSION_NUMBER);
      this.versaoAppEntity.tipoAplicativoEnum = 'FORNECEDOR_EMPREGOS';

      this.versaoAppService.versaoApp(this.versaoAppEntity)
      .then((versaoResult: VersaoAppEntity) => {
        this.versao = versaoResult;

        if(this.versao.descontinuado == true) {
          this.showAlertVersao(this.versao);
        } else {
          this.verificaIdUsuario();
        }

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

  showAlertVersao(versao) {
    const alert = this.alertCtrl.create({
      title: this.languageDictionary.TITLE_ATUALIZACAO_APP,
      subTitle: this.languageDictionary.SUBTITLE_ATUALIZACAO_APP,
      buttons: [
        {
        text: 'OK',
          handler: () => {
            this.getPlatform(versao);
          }
      }]
    });
    alert.present();
  }

  getPlatform(versao) {
    if (this.platform.is('ios')) {
      window.open(versao.linkIos, '_system', 'location=yes');
      this.platform.exitApp();
    }

    if (this.platform.is('android')) {
      window.open(versao.linkAndroid, '_system', 'location=yes');
      this.platform.exitApp();
    }

  }

  verificaIdUsuario() {
    if(!localStorage.getItem(Constants.ID_USUARIO)){
      this.loading.dismiss();
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

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  callLoginByIdService(idUsuario) {

    try {

      this.usuarioEntity.idUsuario = idUsuario;
      this.loginService.loginByIdService(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {
          this.loading.dismiss();
          this.rootPage = PrincipalPage;

        }, (err) => {
          this.loading.dismiss();
          err.message = err.message ? err.message : this.languageDictionary.LABEL_FALHA_CONEXAO_SERVIDOR;
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.logout();
              }
            }]
            // buttons: ['OK']
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
    localStorage.removeItem(Constants.ID_USUARIO);
    localStorage.removeItem(Constants.TOKEN_USUARIO);
    localStorage.removeItem(Constants.NOME_PESSOA);
    this.nav.setRoot(HomePage);
    this.menuCtrl.close();
  }

  confirmaLogout() {
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
            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            // localStorage.removeItem(Constants.IDIOMA_USUARIO);
            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

}
