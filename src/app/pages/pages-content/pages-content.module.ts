import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagesContentPageRoutingModule } from './pages-content-routing.module';

import { PagesContentPage } from './pages-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagesContentPageRoutingModule
  ],
  declarations: [PagesContentPage]
})
export class PagesContentPageModule {}
