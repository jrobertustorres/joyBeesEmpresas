import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CandidatosVagaListPage } from './candidatos-vaga-list';

@NgModule({
  declarations: [
    CandidatosVagaListPage,
  ],
  imports: [
    IonicPageModule.forChild(CandidatosVagaListPage),
  ],
})
export class CandidatosVagaListPageModule {}
