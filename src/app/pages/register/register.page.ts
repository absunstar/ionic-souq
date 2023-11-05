import { Component, OnInit } from '@angular/core';
import { LoginPage } from '../login/login.page';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';

import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: [
    '../content-details/content-details.page.scss',
    './register.page.scss',
  ],
})
export class RegisterPage implements OnInit {
  user: user;
  countriesList: [countriesList];

  constructor(
    private modalCtrl: ModalController,
    public isite: IsiteService,
    private route: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public loadingCtrl: LoadingController
  ) {
    this.user = {
      $error: '',
      $busy: false,
      id: 0,
      first_name: '',
      last_name: '',
      mobile: '',
      email: '',
      password: '',
      re_password: '',
      image_url: '',
      $image_url: '',
      country: {},
    };
    this.getCountriesList();
  }

  ngOnInit() {}

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Camera, Photos or Prompt!
    });
    this.startUpload(image);
  }

  async startUpload(image: any) {
    const base64Response = await fetch(image.dataUrl);
    const blob = await base64Response.blob();
    const formData = new FormData();
    formData.append('fileToUpload', blob, 'image1.png');
    this.uploadData(formData);
  }
  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'جاري تحميل الصورة',
    });
    await loading.present();
    this.http
      .post(`${this.isite.baseURL}/x-api/upload/image`, formData)
      .subscribe((res: any) => {
        this.user.image_url = res.image.url;
        this.user.$image_url = this.isite.baseURL + res.image.url;
        loading.dismiss();
      });
  }

  addUser(user) {
    if (user.$busy) {
      return;
    }

    if (user) {
      user.$error = '';
      if (!user.first_name) {
        user.$error = 'يجب إدخال الإسم الأول';
        return;
      } else if (!user.last_name) {
        user.$error = 'يجب إدخال الإسم الثاني';
        return;
      } else if (!user.email) {
        user.$error = 'يجب إدخال البريد';
        return;
      } else if (!user.mobile) {
        user.$error = 'يجب إدخال الجوال';
        return;
      } else if (!user.password) {
        user.$error = 'يجب إدخال كلمة السر';
        return;
      } else if (!user.country) {
        user.$error = 'يجب إختيار الدولة';
        return;
      }
      if (user.password === user.re_password) {
        let country = this.countriesList.find((a) => a.id == user.country);

        let obj = {
          email: user.email,
          password: user.password,
          mobile: user.mobile,
          first_name: user.first_name,
          last_name: user.last_name,
          image_url: user.image_url,
          country_code: country.country_code,
          length_mobile: country.length_mobile,
        };
        user.$busy = true;
        this.isite
          .api({
            url: '/api/register',
            body: obj,
          })
          .subscribe((res: any) => {
            user.$busy = false;
            if (res.error) {
              user.$error = res.error;
            } else if (res.user) {
              this.isite.getUserSession(() => {
                this.router.navigateByUrl('/home', { replaceUrl: true });
              });
            }
          });
      } else {
        user.$error = 'كلمة السر غير متطابقة';
      }
    } else {
      user.$error = 'يجب ملء البيانات';
    }
  }

  getCountriesList() {
    this.isite
      .api({
        url: '/api/countries/all',
        body: {
          where: {
            active: true,
          },
          select: {
            id: 1,
            name_ar: 1,
            name_en: 1,
            code: 1,
            image_url: 1,
            country_code: 1,
            length_mobile: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done && res.list.length > 0) {
          for (let i = 0; i < res.list.length; i++) {
            const element = res.list[i];
            if (element.image_url) {
              element.image_url = this.isite.baseURL + element.image_url;
            }
            element.country_code = element.country_code || '';
            element.length_mobile = element.length_mobile || 0;
          }
          this.countriesList = res.list;
        }
      });
  }

  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }
}
export interface user {
  id: number;
  $busy: boolean;
  image_url: string;
  $image_url: string;
  $error: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  password: string;
  re_password: string;
  country: any;
}
export interface countriesList {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
  code: string;
  country_code: string;
  length_mobile: number;
}
