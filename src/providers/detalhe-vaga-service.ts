// import { Http, Headers, RequestOptions } from '@angular/http';
// import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
// import { Constants } from '../app/constants';

// //ENTITY

// @Injectable()
// export class DetalhesVagaService {

//   private headers = new Headers({ 'Content-Type': 'application/json' });
//   private options = new RequestOptions({ headers: this.headers, method: "post" });

//   constructor(private _http: Http) {
//   }

//   public findVagaDetalhe(idVaga) {
//     try {

//       return new Promise((resolve, reject) => {
//         this._http.post(Constants.API_URL + 'findDetalheVagaByIdVaga/'
//           + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
//           .map(res=>res.json())
//           .subscribe(data => {
//             resolve(data);
//           }, (err) => {
//             reject(err.json());
//           });
//       });

//     } catch (e){
//       if(e instanceof RangeError){
//         console.log('out of range');
//       }
//     }
//   }

  
// }
