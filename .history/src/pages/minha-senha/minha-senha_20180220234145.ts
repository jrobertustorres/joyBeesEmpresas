import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';

// SERVICES
import { UsuarioService } from '../../providers/usuario-service';

// PAGES
import { ConfiguracoesPage } from '../../pages/configuracoes/configuracoes';

//UTILITARIOS
import { PasswordValidation } from './../utilitarios/password-validation';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-minha-senha',
  templateUrl: 'minha-senha.html',
})
export class MinhaSenhaPage {
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  public minhaSenhaForm: FormGroup;

  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private messagePresentToast: string;
  private _idioma: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              translate: TranslateService) {

    this.translate = translate;
    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {
    this.getLanguage();
    this.minhaSenhaForm = this.formBuilder.group({
      'senha': ['', Validators.required],
      'novaSenha': ['', Validators.required],
      'confirmSenha': ['', Validators.required]
    }, {
        validator: PasswordValidation.MatchPasswordAlterarSenha // your validation method
      }
    );
  }

  ionViewDidLoad() {
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.messagePresentToast,
      duration: 3000,
      position: 'middle',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  submeterNovaSenha() {
    if (this.minhaSenhaForm.valid) {
      
      try {
        
        this.loading = this.loadingCtrl.create({
          content: this.loading
        });
        this.loading.present();

        this.usuarioService
        .atualizaSenhaUsuario(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {

          this.loading.dismiss();
          this.presentToast();
          setTimeout(() => {
            this.navCtrl.setRoot(ConfiguracoesPage);
          }, 3000);
    
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
    } else {
      Object.keys(this.minhaSenhaForm.controls).forEach(campo => {
        const controle = this.minhaSenhaForm.get(campo);
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
      if (this.selectedLanguage == 'pt-br') {
        this.loading = 'Aguarde...';
        this.messagePresentToast = 'Sua senha foi alterada!';
      } else {
        this.loading = 'Wait...';
        this.messagePresentToast = 'Your password has been changed!';
      }
    }
    this.translate.use(this.selectedLanguage);
  }

}
