import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CriaVagaPage } from './cria-vaga';

@NgModule({
  declarations: [
    CriaVagaPage,
  ],
  imports: [
    IonicPageModule.forChild(CriaVagaPage),
  ],
})
export class CriaVagaPageModule {}
