import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';
// import { Storage } from '@ionic/storage';

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
              // private _storage: Storage,
              public loadingCtrl: LoadingController) {
    this.empresaEntity = new EmpresaEntity();
  }

  public findVagaFinalizadasFornecedorByVaga(vagaDetalheEntity) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL  + 'findVagaFinalizadasFornecedorByVaga/'
        + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(vagaDetalheEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err.json());
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
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
            reject(err.json());
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
        this.http.post(Constants.API_URL  + 'findVagaByVaga/'
        + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(filtro), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err.json());
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
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'findDetalheVagaByIdVaga/'
            + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
        // });
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
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'findVagaCandidatarByVagaUsuario/'
            + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
        // });
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
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'candidatarVaga/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
          // });
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
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'descandidatarVaga/' 
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
          // });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public descartarCandidatoVagaByFornecedor(idVagaUsuario ) {
    try {

      return new Promise((resolve, reject) => {
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'descartarUsuarioVaga/' 
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVagaUsuario ), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
          // });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public setFinalistaCandidatoVagaByFornecedor(idVagaUsuario ) {
    try {

      return new Promise((resolve, reject) => {
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'finalistaUsuarioVaga/' 
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVagaUsuario ), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
          // });
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
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'criarVaga/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(vagaDetalheEntity), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
          // });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public alteraVaga(vagaDetalheEntity) {
    try {

      // this.usuarioEntity = new UsuarioEntity();

      return new Promise((resolve, reject) => {
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'alteraVaga/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(vagaDetalheEntity), this.options)
            .map(function (res) { return res.json(); })
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
        // });
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
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'findVagaFornecedorByVaga/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(filtro), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
        // });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public getEmpresas() {
    try {

      return new Promise((resolve, reject) => {
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL  + 'findListaEmpresas/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
        // });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findUsuarioByIdVaga(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'findUsuarioByIdVaga/'
            + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
        // });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findFavoritosVaga(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'findVagaUsuarioFinalistaByIdVaga /'
            + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
        // });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public fecharVaga(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL  + 'fecharVaga/'
        + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err.json());
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }


}

