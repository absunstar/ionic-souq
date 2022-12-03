import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from './database.service';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class IsiteService {
  accessToken: string = null;
  baseURL: string = 'https://souq.egytag.com';
  loader: HTMLIonLoadingElement = null;
  constructor(
    public http: HttpClient,
    public db: DatabaseService,
    public router: Router,
    private alerCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {}

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

  msg(msg: string) {
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
  async showLoading() {
    if (this.loader) {
      this.loader.present();
    } else {
      const loader = await this.loadingCtrl.create({
        message: ' انتظر قليلا - جارى التحميل',
      });
      this.loader = loader;
      this.loader.present();
    }
  }
  hideLoading() {
    this.loader.dismiss();
  }

  async start() {
    await this.showLoading();
    if (!this.accessToken) {
      this.accessToken =
        (await (await Preferences.get({ key: 'accessToken' })).value) || null;
      if (this.accessToken) {
        this.loadSetting();
      }
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
            }
            this.loadSetting();
          }
        });
    }
  }

  async post(options: any) {
    return new Promise((resolve, reject) => {
      if (!this.accessToken) {
        this.start();
        setTimeout(() => {
          this.post(options);
        }, 1000 * 5);
      } else {
        options.headers = options.headers || {};
        options.headers['Access-Token'] = this.accessToken;
        this.http
          .post(options.url, options.body, { headers: options.headers })
          .subscribe((res: any) => {
            resolve(res);
          });
      }
    });
  }

  loadPosts() {
    this.post({ url: this.baseURL + '/api/posts/all' }).then((res: any) => {
      if (res.done) {
        this.db.list = res.list;
        console.log(this.db.list);
      }
    });
  }
  loadSetting() {
    this.post({ url: this.baseURL + '/api/default_setting/get' }).then(
      (res: any) => {
        if (res.done) {
          this.db.setting = res.doc;
          this.db.setting.logo = this.baseURL + this.db.setting.logo;
          //  this.msg('التطبيق جاهز للعمل');
          this.hideLoading();
          setTimeout(() => {
           // window.open(this.baseURL+'?access_token=' + this.accessToken, '_self');
          }, 1000 * 3);
        }
      }
    );
  }
}
