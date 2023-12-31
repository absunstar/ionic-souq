import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserManagePageRoutingModule } from './user-manage-routing.module';

import { UserManagePage } from './user-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserManagePageRoutingModule
  ],
  declarations: [UserManagePage]
})
export class UserManagePageModule {}
