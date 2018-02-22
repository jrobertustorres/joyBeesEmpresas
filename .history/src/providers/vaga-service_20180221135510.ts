import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';
import { Storage } from '@ionic/storage';

//ENTITY
import { EmpresaEntity } from '../model/empresa-entity';

@Injectable()
export class VagaService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public urlServico: string;
  private empresaEntity: EmpresaEntity;

  constructor(public http: Http, 
              public alertCtrl: AlertController, 
              private _storage: Storage,
              public loadingCtrl: LoadingController) {
    this.empresaEntity = new EmpresaEntity();
  }

  public getVagasHome() {
    try {

      return new Promise((resolve, reject) => {
        // this.http.post(Constants.API_URL  + 'findVagaByVaga/', this.options)
        this.http.post(Constants.API_URL  + 'findVagaDestaqueByVaga/', this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            // reject(err.json());
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public getVagasPrincipal(filtro) {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'findVagaByVaga/'
          + tokenUsuario, JSON.stringify(filtro), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
        });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findVagaDetalhe(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'findDetalheVagaByIdVaga/'
            + tokenUsuario, JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
        });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findVagasCandidatadas() {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'findVagaCandidatarByVagaUsuario/'
            + tokenUsuario, this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
        });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public callCandidatarVaga(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'candidatarVaga/'
          + tokenUsuario, JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public callDescartarVaga(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'descandidatarVaga/' 
          + tokenUsuario, JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public criaVaga(vagaDetalheEntity) {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'criarVaga/'
          + tokenUsuario, JSON.stringify(vagaDetalheEntity), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findVagaFornecedorByVaga(filtro) {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'findVagaFornecedorByVaga/'
          + tokenUsuario, JSON.stringify(filtro), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
        });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public getEmpresas() {
    // this.cidadeEntity = new CidadeEntity();
    // this.cidadeEntity.idEstado = idEstado;
    
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'findListaEmpresas/'
          + tokenUsuario, this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
        });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }


}

