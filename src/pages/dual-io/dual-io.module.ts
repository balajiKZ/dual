import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DualIoPage } from './dual-io';

@NgModule({
  declarations: [
    DualIoPage,
  ],
  imports: [
    IonicPageModule.forChild(DualIoPage),
  ],
})
export class DualIoPageModule {}
