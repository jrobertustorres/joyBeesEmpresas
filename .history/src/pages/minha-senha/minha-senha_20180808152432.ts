import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';

// SERVICES
import { UsuarioService } from '../../providers/usuario-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

// PAGES
import { ConfiguracoesPage } from '../../pages/configuracoes/configuracoes';

//UTILITARIOS
import { PasswordValidation } from './../../utilitarios/password-validation';

@IonicPage()
@Component({
  selector: 'page-minha-senha',
  templateUrl: 'minha-senha.html',
})
export class MinhaSenhaPage {
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  public minhaSenhaForm: FormGroup;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private languageTranslateService: LanguageTranslateService) {

    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {
    this.getTraducao();
    this.minhaSenhaForm = this.formBuilder.group({
      'senha': ['', Validators.required],
      'novaSenha': ['', Validators.required],
      'confirmSenha': ['', Validators.required]
    }, {
        validator: PasswordValidation.MatchPasswordAlterarSenha
      }
    );
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
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
      message: this.languageDictionary.SENHA_ALTERADA_SUCESSO,
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
          content: this.languageDictionary.LOADING_TEXT,
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

}
