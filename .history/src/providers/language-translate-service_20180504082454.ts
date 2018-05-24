import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

@Injectable()
export class LanguageTranslateService {
    languages = availableLanguages;
    selectedLanguage = null;
    // private translate: TranslateService;
    private _idioma: string;

    // private loading: any;
    private loadingText: string;

  constructor(private http: Http, 
              private _storage: Storage) {
  }

  getTranslate() {
        this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
        return this._storage.get('selectedLanguage').then((selectedLanguage) => {
            if(!selectedLanguage){
            this.selectedLanguage = this._idioma;
            }
            else if(selectedLanguage) {
            this.selectedLanguage = selectedLanguage;
            if (this.selectedLanguage == 'pt-br') {
                this.loadingText = 'Aguarde...';
            } else {
                this.loadingText = 'Wait...';
            }
            }
            // this.translate.use(this.selectedLanguage);
            
        });
        // return this.selectedLanguage;
    }
}
