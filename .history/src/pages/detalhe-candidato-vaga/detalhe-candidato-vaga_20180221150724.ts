import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';


@IonicPage()
@Component({
  selector: 'page-detalhe-candidato-vaga',
  templateUrl: 'detalhe-candidato-vaga.html',
})
export class DetalheCandidatoVagaPage {
  languages = availableLanguages;
  selectedLanguage: any;
  private translate: TranslateService;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService) {
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
  }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    } else if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.messagePresentToast = 'Parabéns! Você está candidatado à esta vaga!';
        this.messageDescartarToast = 'Você não está mais candidatado à esta vaga!';
        this.loadingText = 'Aguarde...';
        this.subTitleVaga = 'Deseja se candidatar à esta vaga?';
        this.subTitleDescartarVaga = 'Deseja descartar esta vaga?';
        this.candidatarText = 'CANDIDATAR-ME';
        this.descartarText = 'DESCARTAR';
        this.cancelar = 'CANCELAR';
        this.manter = 'MANTER';
        this.titleCadastro = 'Cadastro incompleto!';
        this.subTitleCadastro = 'Para se candidatar, você precisa completar seu cadastro.';
      } else {
        this.messagePresentToast = 'Congratulations! You are applying for this vacancy!';
        this.messageDescartarToast = 'You are no longer a candidate for this job!';
        this.loadingText = 'Wait...';
        this.subTitleVaga = 'Do you want to apply for this vacancy?';
        this.subTitleDescartarVaga = 'Do you want to discard this vacancy?';
        this.candidatarText = 'APPLY FOR';
        this.descartarText = 'DISCARD';
        this.cancelar = 'CANCEL';
        this.manter = 'KEEP';
        this.titleCadastro = 'Incomplete registration!';
        this.subTitleCadastro = 'To apply, you need to complete your registration.';
      }
    }
    // this.callDetalheVaga();
    this.translate.use(this.selectedLanguage);
  }

}
