import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificPageRoutingModule } from './notific-routing.module';

import { NotificPage } from './notific.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificPageRoutingModule
  ],
  declarations: [NotificPage]
})
export class NotificPageModule {}
