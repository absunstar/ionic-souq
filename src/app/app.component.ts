import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LoginPage } from './pages/login/login.page';
import { IsiteService } from './services/isite.service';
import {
  InAppBrowser,
  InAppBrowserObject,
} from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    public iab: InAppBrowser

  ) {
    
  }
  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }

  CreateNewAd(){
    this.iab.create(
      this.isite.baseURL + '/create_content' + '?access-token=' + this.isite.accessToken,
      '_self',
      {
        location: 'no', //Or 'no'
        hidden: 'yes', //Or  'yes'
        clearcache: 'no',
        clearsessioncache: 'no',
        zoom: 'no', //Android only ,shows browser zoom controls
        hardwareback: 'yes',
        mediaPlaybackRequiresUserAction: 'no',
        shouldPauseOnSuspend: 'no', //Android only
        closebuttoncaption: 'Close', //iOS only
        disallowoverscroll: 'no', //iOS only
        toolbar: 'no', //iOS only
        enableViewportScale: 'no', //iOS only
        allowInlineMediaPlayback: 'no', //iOS only
        presentationstyle: 'pagesheet', //iOS only
        fullscreen: 'yes', //Windows only
      }).show();
  }
}
