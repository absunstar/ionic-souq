import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesContentPage } from './pages-content.page';

const routes: Routes = [
  {
    path: '',
    component: PagesContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesContentPageRoutingModule {}
