import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';
import { Storage } from '@ionic/storage';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';

//SERVICES
import { UsuarioService } from '../../providers/usuario-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//PAGES
import { HomePage } from '../home/home';

// @IonicPage()
@Component({
  selector: 'page-recuperar-senha',
  templateUrl: 'recuperar-senha.html',
})

export class RecuperarSenhaPage implements OnInit {

  private loading: any;
  private usuarioEntity: UsuarioEntity;
  public recuperarSenhaForm: FormGroup;
  private messagePresentToast: string;

  languages = availableLanguages;
  // selectedLanguage = sysOptions.systemLanguage;
  selectedLanguage = null;
  private translate: TranslateService;
  private _idioma: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              translate: TranslateService,
              private usuarioService: UsuarioService,
              public alertCtrl: AlertController,
              private _storage: Storage,
              private toastCtrl: ToastController) {

    this.translate = translate;
    // this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    // this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? this._idioma : localStorage.getItem("selectedLanguage");
    // this.translate.use(this.selectedLanguage);  

    this.usuarioEntity = new UsuarioEntity();

  }

  ngOnInit() {
    this.getLanguage();
    this.recuperarSenhaForm = this.formBuilder.group({
      'login': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
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

  submeterRecuperarSenha() {
    try {
      if (this.recuperarSenhaForm.valid) {
        // if (this.selectedLanguage == 'pt-br') {
        //   this.loading = 'Aguarde...';
        // } else {
        //   this.loading = 'Wait...';
        // }
        this.loading = this.loadingCtrl.create({
          content: this.loading
        });
        this.loading.present();

        this.usuarioService
        .recuperasenhaService(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {
    
          this.loading.dismiss();
          this.presentToast();
          setTimeout(() => {
            this.navCtrl.push(HomePage);
          }, 3000);
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
        
      } else {
        Object.keys(this.recuperarSenhaForm.controls).forEach(campo => {
          const controle = this.recuperarSenhaForm.get(campo);
          controle.markAsTouched();
        })
      }
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  getLanguage(){
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    // this._storage.get('selectedLanguage').then((selectedLanguage) => {
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          this.selectedLanguage = this.selectedLanguage;
          console.log(this.selectedLanguage);
          if (this.selectedLanguage == 'pt-br') {
            this.loading = 'Aguarde...';
            this.messagePresentToast = 'Um email foi enviado com a nova senha! Favor verificar.';
          } else {
            this.loading = 'Wait...';
            this.messagePresentToast = 'An email was sent with the new password! Please check.';
          }
        }
        this.translate.use(this.selectedLanguage);

      // });


    // if (this.selectedLanguage == 'pt-br') {
    //   this.loading = 'Aguarde...';
    //   this.messagePresentToast = 'Um email foi enviado com a nova senha! Favor verificar.';
    // } else {
    //   this.loading = 'Wait...';
    //   this.messagePresentToast = 'An email was sent with the new password! Please check.';
    // }
  }

}
