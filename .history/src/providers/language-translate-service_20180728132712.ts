import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';
// import { Storage } from '@ionic/storage';

//I18N
import { availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

@Injectable()
export class LanguageTranslateService {
    languages = availableLanguages;
    selectedLanguage = null;
    private _idioma: string;

    private loadingText: string;

  constructor(private http: Http) {
  }

  getTranslate() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
        if(!localStorage.getItem(Constants.IDIOMA_USUARIO)){
            this.selectedLanguage = this._idioma;
            localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);
        } else {
            this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        }
        // else {
            // this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
            
            if (this.selectedLanguage == 'pt-br') {
                return this.http.get('assets/i18n/pt-br.json')
                .map((res: Response) => res.json());
            } else if (this.selectedLanguage == 'en'){
                return this.http.get('assets/i18n/en.json')
                .map((res: Response) => res.json());
            }
    }

//   getTranslate() {
//         this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
//         return this._storage.get('selectedLanguage').then((selectedLanguage) => {
//             if(!selectedLanguage){
//             this.selectedLanguage = this._idioma;
//             }
//             else if(selectedLanguage) {
//             this.selectedLanguage = selectedLanguage;
//             if (this.selectedLanguage == 'pt-br') {
//                 this.loadingText = 'Aguarde...';
//             } else {
//                 this.loadingText = 'Wait...';
//             }
//             }
//             // this.translate.use(this.selectedLanguage);
            
//         });
//         // return this.selectedLanguage;
//     }
}
