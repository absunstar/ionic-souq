import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
      canLoad: [IntroGuard] // Check if we should show the introduction or forward to inside

  },
  {
    path: 'online',
    loadChildren: () =>
      import('./pages/online/online.module').then((m) => m.OnlinePageModule),
      canLoad: [IntroGuard] // Check if we should show the introduction or forward to inside

  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
  {
    path: 'content-details',
    loadChildren: () => import('./pages/content-details/content-details.module').then( m => m.ContentDetailsPageModule)
  },
  {
    path: 'online',
    loadChildren: () => import('./pages/online/online.module').then( m => m.OnlinePageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },  {
    path: 'favorite',
    loadChildren: () => import('./pages/favorite/favorite.module').then( m => m.FavoritePageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
