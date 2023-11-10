import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LoginPage } from './pages/login/login.page';
import { IsiteService } from './services/isite.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { menuController } from '@ionic/core';
import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import {
  InAppBrowser,
  InAppBrowserObject,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './pages/content-details/content-details.page.scss',
    'app.component.scss',
  ],
})
export class AppComponent {
  header_category_list: [header_category_list];
  page_number: number = 0;

  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    public iab: InAppBrowser,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController
  ) {
    this.startTime();
    this.getCategories();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'تأكيد تسجيل الخروج',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.isite
              .api({
                url: '/api/user/logout',
              })
              .subscribe((resUser: any) => {
                if (resUser.accessToken) {
                  this.isite.accessToken = resUser.accessToken;
                }
                if (resUser.done) {
                  this.isite.db.userSession = null;
                  this.isite.getUserSession(() => {
                    this.router.navigateByUrl('/', { replaceUrl: true });
                  });
                } else {
                }
              });
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }
 async hideMenu() {
     await menuController.toggle();
  }
  getCategories() {
    if (this.header_category_list && this.header_category_list.length > 0) {
      return false;
    }
    this.isite
      .api({
        url: '/api/main_categories/all',
        body: {
          where: {
            status: 'active',
            top_parent_id: { $exists: false },
          },
          select: {
            id: 1,
            name_ar: 1,
            name_en: 1,
            image_url: 1,
          },
          limit: 8,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.header_category_list = res.list;
        }
      });
  }

  startTime() {
    var d = new Date();
    var local = d.getTime();
    var offset = d.getTimezoneOffset() * (60 * 1000);
    var utc = new Date(local + offset);
    var riyadh = new Date(utc.getTime() + 3 * 60 * 60 * 1000);
    let h = riyadh.getHours();
    let m = riyadh.getMinutes();
    let s = riyadh.getSeconds();
    m = this.checkTime(m);
    s = this.checkTime(s);
    this.isite.db.time.time1 = h + ':' + m + ':' + s;
    /* document.getElementById("time1").innerHTML = h + ":" + m + ":" + s; */
    setTimeout(() => {
      this.startTime();
    }, 1000);
  }

  checkTime(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }

  userMessages() {
    this.iab
      .create(
        this.isite.baseURL +
          '/messages' +
          '?access-token=' +
          this.isite.accessToken,
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
        }
      )
      .show();
  }

  userProfile() {
    if (this.isite.db.userSession) {
      this.iab
        .create(
          this.isite.baseURL +
            '/profile' +
            '/' +
            this.isite.db.userSession.id +
            '/' +
            this.isite.db.userSession.name +
            '/' +
            this.isite.db.userSession.last_name +
            '?access-token=' +
            this.isite.accessToken,
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
          }
        )
        .show();
    }
  }

  userManage() {
    if (this.isite.db.userSession) {
      this.iab
        .create(
          this.isite.baseURL +
            '/manage_user' +
            '?access-token=' +
            this.isite.accessToken,
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
          }
        )
        .show();
    }
  }

  createNewAd() {
    this.iab
      .create(
        this.isite.baseURL +
          '/create_content' +
          '?access-token=' +
          this.isite.accessToken,
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
        }
      )
      .show();
  }

  async gotoHome() {
    this.router.navigateByUrl('/home?time=' + Date.now(), { replaceUrl: true });
  }
}
export interface header_category_list {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
}
