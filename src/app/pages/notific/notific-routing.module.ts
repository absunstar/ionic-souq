import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificPage } from './notific.page';

const routes: Routes = [
  {
    path: '',
    component: NotificPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificPageRoutingModule {}
