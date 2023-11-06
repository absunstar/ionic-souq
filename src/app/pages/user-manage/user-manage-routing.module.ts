import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagePage } from './user-manage.page';

const routes: Routes = [
  {
    path: '',
    component: UserManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagePageRoutingModule {}
