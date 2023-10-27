import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from './database.service';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserObject,
} from '@awesome-cordova-plugins/in-app-browser/ngx';

import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsiteService {
  busy: boolean = false;
  accessToken: string = null;
  baseURL: string = 'http://127.0.0.1';
  loader: HTMLIonLoadingElement = null;
  browser: InAppBrowserObject = null;
  constructor(
    public http: HttpClient,
    public db: DatabaseService,
    public router: Router,
    private alerCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public iab: InAppBrowser
  ) {
    let ii = setInterval(() => {
      if (this.accessToken) {
        clearInterval(ii);
        // this.initBrowser();
        // this.api('/api/default_setting/get').subscribe((res: any) => {
        //   if (res.done) {
        //     this.db.setting = res.doc;
        //     this.db.setting.logo = this.baseURL + this.db.setting.logo;
        //   }
        // });
      }
    }, 1000);
    this.start();
  }

  alert(title: any, msg: any) {
    return this.alerCtrl.create({
      header: title,
      message: msg,
      buttons: [
        {
          text: 'موافق',
        },
      ],
    });
  }

  toast(msg: string) {
    return this.toastCtrl
      .create({
        message: msg,
        duration: 2000,
        position: 'bottom',
        cssClass: 'toast',
      })
      .then((toast) => {
        toast.present();
      });
  }

  async start() {
    if (this.busy) {
      return false;
    }
    this.busy = true;

    const loader = await this.loadingCtrl.create({
      message: ' انتظر قليلا - جارى التحميل',
    });
    await loader.present();
    if (!this.accessToken) {
      this.accessToken =
        (await (await Preferences.get({ key: 'accessToken' })).value) || null;
    }
    this.api({
      url: '/x-api/session',
      body: {},
    }).subscribe((resUserSession: any) => {
      loader.dismiss();
      if (resUserSession.done) {
        if (resUserSession.session.user) {
          this.db.userSession = {
            id: resUserSession.session.user.id,
            email: resUserSession.session.user.email,
            name: resUserSession.session.user.profile.name,
            last_name: resUserSession.session.user.profile.last_name,
            image_url: resUserSession.session.user.profile.image_url,
            feedback_list: resUserSession.session.user.feedback_list,
            message_count: resUserSession.session.user.message_count,
            
          };
          this.db.userSession.image_url =
            this.baseURL + this.db.userSession.image_url;
        }
      }
    });

    /*     if (!this.accessToken) {
      this.accessToken =
        (await (await Preferences.get({ key: 'accessToken' })).value) || null;
    }
    if (!this.accessToken) {
      this.http
        .post(this.baseURL + '/x-api/session', {})
        .subscribe((res: any) => {
          if (res.done) {
            this.accessToken = res.session.accessToken;
            if (this.accessToken) {
              Preferences.set({
                key: 'accessToken',
                value: this.accessToken,
              });
              loader.dismiss();
              this.busy = false;
            }
          }
        });
    } else {
      loader.dismiss();
      this.busy = false;
    } */
  }

  api(options: any) {
    if (typeof options == 'string') {
      options = {
        url: options,
        type: 'post',
      };
    }
    console.log(' [ API ] ', options);

    options.headers = options.headers || {};
    options.headers['Access-Token'] = this.accessToken || '';
    options.url = this.baseURL + options.url;
    if (options.type == 'get') {
      return this.http.get(options.url, {
        headers: options.headers,
      });
    } else {
      return this.http.post(options.url, options.body, {
        headers: options.headers,
      });
    }
  }

  openOnlineSite() {
    let ii = setInterval(() => {
      if (this.accessToken) {
        clearInterval(ii);
        if (this.browser) {
          this.browser.show();
        } else {
          this.initBrowser();
          this.browser.show();
        }
      }
    }, 100);
  }

  initBrowser() {
    let ii = setInterval(() => {
      if (this.accessToken) {
        clearInterval(ii);
        if (!this.browser) {
          this.browser = this.iab.create(
            this.baseURL + '/create-ad' + '?access-token=' + this.accessToken,
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
          );
          this.browser.on('loadstart').subscribe(
            (event) => {
              console.log('loadstart -->', event);
            },
            (err) => {
              console.log('InAppBrowser loadstart Event Error: ' + err);
            }
          );
        }
      }
    }, 100);
  }
}
