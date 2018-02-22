import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CriarVagaPage } from './criar-vaga';

@NgModule({
  declarations: [
    CriarVagaPage,
  ],
  imports: [
    IonicPageModule.forChild(CriarVagaPage),
  ],
})
export class CriarVagaPageModule {}
