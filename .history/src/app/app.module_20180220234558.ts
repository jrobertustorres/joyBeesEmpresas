import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

//PAGES
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { PrincipalPage } from '../pages/principal/principal';
import { RecuperarSenhaPage } from '../pages/recuperar-senha/recuperar-senha';
import { ModalPoliticaPrivacidadePage } from '../pages/modal-politica-privacidade/modal-politica-privacidade';
import { ModalTermosPage } from '../pages/modal-termos/modal-termos';
import { MenuPage } from '../pages/menu/menu';
import { CriaVagaPage } from '../pages/cria-vaga/cria-vaga';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { MinhaSenhaPage } from '../pages/minha-senha/minha-senha';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//PROVIDERS
import { LanguageProvider } from '../providers/language-provider';

//TRANSLATE
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization';

//ENTITYS
import { UsuarioDetalheEntity } from '../model/usuario-detalhe-entity';
import { CidadeEntity } from '../model/cidade-entity';
import { VagaListaEntity } from '../model/vaga-lista-entity';
import { VagaDetalheEntity} from '../model/vaga-detalhe-entity';

//SERVICES
import { EstadosService } from '../providers/estados-service';
import { CidadesService } from '../providers/cidades-service';
import { UsuarioService } from '../providers/usuario-service';
import { LoginService } from '../providers/login-service';
import { VagaService } from '../providers/vaga-service';
import { LanguageTranslateService } from '../providers/language-translate-service';

import { HttpClientModule, HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

function provideStorage() {
  return new Storage({ 
    name: 'joybeesempresa',
    storeName: 'usuario'
  });
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    PrincipalPage,
    RecuperarSenhaPage,
    ModalPoliticaPrivacidadePage,
    ModalTermosPage,
    MenuPage,
    CriaVagaPage,
    ConfiguracoesPage,
    MinhaSenhaPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    PrincipalPage,
    RecuperarSenhaPage,
    ModalPoliticaPrivacidadePage,
    ModalTermosPage,
    MenuPage,
    CriaVagaPage,
    ConfiguracoesPage,
    MinhaSenhaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Globalization,
    UsuarioDetalheEntity,
    CidadeEntity,
    VagaListaEntity,
    EstadosService,
    CidadesService,
    UsuarioService,
    LoginService,
    VagaService,
    LanguageTranslateService,
    LanguageProvider,
    VagaDetalheEntity,
    {provide: Storage, useFactory: provideStorage}
  ]
})
export class AppModule {}
