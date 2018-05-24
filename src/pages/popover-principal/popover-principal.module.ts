import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPrincipalPage } from './popover-principal';

@NgModule({
  declarations: [
    PopoverPrincipalPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPrincipalPage),
  ],
})
export class PopoverPrincipalPageModule {}
