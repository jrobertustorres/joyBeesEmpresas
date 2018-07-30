import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VagasArquivadasListPage } from './vagas-arquivadas-list';

@NgModule({
  declarations: [
    VagasArquivadasListPage,
  ],
  imports: [
    IonicPageModule.forChild(VagasArquivadasListPage),
  ],
})
export class VagasArquivadasListPageModule {}
