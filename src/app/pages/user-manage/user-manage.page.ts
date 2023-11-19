import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

import {
  NavController,
  MenuController,
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
  selector: 'app-user-manage',
  templateUrl: './user-manage.page.html',
  styleUrls: ['./user-manage.page.scss'],
})
export class UserManagePage implements OnInit {
  user: user;
  contentList: [content];
  countries_list: [countries_list];
  goves_list: [goves_list];
  cities_list: [cities_list];
  areas_list: [areas_list];
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    public http: HttpClient,
    public loadingCtrl: LoadingController
  ) {
    this.user = {
      id: 0,
      $genderList: [],
      $busy: false,
      $error: '',
      $gender: '',
      email: '',
      name: '',
      last_name: '',
      $current_password: '',
      $new_password: '',
      $re_password: '',
      mobile: '',
      $mobile: false,
      profile: {},
      gender: {},
      $personal: false,
      $password: false,
      $myAds: false,
      $address: false,
      $other_mobile: '',
      mobile_list : [],
    };
    this.getUser();
    this.loadMyAds();
    this.getCountries();
  }

  ngOnInit() {}

  async selectImage(type) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Camera, Photos or Prompt!
    });
    this.startUpload(image, type);
  }

  async startUpload(image: any, type) {
    const base64Response = await fetch(image.dataUrl);
    const blob = await base64Response.blob();
    const formData = new FormData();
    formData.append('fileToUpload', blob, 'image1.png');
    this.uploadData(formData, type);
  }
  async uploadData(formData: FormData, type) {
    const loading = await this.loadingCtrl.create({
      message: 'جاري تحميل الصورة',
    });
    await loading.present();
    this.http
      .post(`${this.isite.baseURL}/x-api/upload/image`, formData)
      .subscribe((res: any) => {
        if (type == 'logo') {
          this.user.profile.image_url = res.image.url;
          this.user.profile.$image_url = this.isite.baseURL + res.image.url;
        } else if (type == 'cover') {
          this.user.profile.cover = res.image.url;
          this.user.profile.$cover = this.isite.baseURL + res.image.url;
        }
        this.editPersonalInfoUser(type);

        /* this.user.image_url = res.image.url;
        this.user.$image_url = this.isite.baseURL + res.image.url; */
        loading.dismiss();
      });
  }

  showContent(type) {
    this.user.$personal = false;
    this.user.$password = false;
    this.user.$myAds = false;
    this.user.$address = false;
    this.user.$mobile = false;
    if (type == 'personal') {
      this.user.$personal = true;
    } else if (type == 'password') {
      this.user.$password = true;
    } else if (type == 'myAds') {
      this.user.$myAds = true;
    } else if (type == 'address') {
      this.user.$address = true;
    } else if (type == 'mobile') {
      this.user.$mobile = true;
    }
  }
  getUser() {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.isite
        .api({
          url: '/api/manage_user/view',
          body: { id: this.isite.db.userSession.id },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.user = res.doc;

            this.user.profile.$cover =
              this.isite.baseURL + this.user.profile.cover;
            this.user.profile.$image_url =
              this.isite.baseURL + this.user.profile.image_url;
            if (this.user.gender) {
              this.user.$gender = this.user.gender.name;
            }
            this.user.profile.main_address =
              this.user.profile.main_address || {};
            if (this.user.profile.main_address) {
            }
            this.user.profile.main_address.$country;
            if (
              this.user.profile.main_address.country &&
              this.user.profile.main_address.country.id
            ) {
              this.user.profile.main_address.$country =
                this.user.profile.main_address.country.id.toString();
              this.getGoves(this.user.profile.main_address.country.id);
            }
            if (
              this.user.profile.main_address.gov &&
              this.user.profile.main_address.gov.id
            ) {
              this.user.profile.main_address.$gov =
                this.user.profile.main_address.gov.id.toString();
              this.getCities(this.user.profile.main_address.gov.id);
            }
            if (
              this.user.profile.main_address.city &&
              this.user.profile.main_address.city.id
            ) {
              this.user.profile.main_address.$city =
                this.user.profile.main_address.city.id.toString();
              this.getAreas(this.user.profile.main_address.city.id);
            }
            if (
              this.user.profile.main_address.area &&
              this.user.profile.main_address.area.id
            ) {
              this.user.profile.main_address.$area =
                this.user.profile.main_address.area.id.toString();
            }
            if (this.user.profile.main_address.detailed_address) {
              this.user.profile.main_address.detailed_address =
                this.user.profile.main_address.detailed_address;
            }
            console.log(this.user.profile.main_address.$country);

            this.user.$genderList = [
              {
                name: 'male',
                en: 'Male',
                ar: 'ذكر',
              },

              {
                name: 'female',
                en: 'Female',
                ar: 'أنثى',
              },
            ];
          }
        });
    }
  }

  editPersonalInfoUser(type) {
    this.user.$error = '';
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      if (type == 'gender') {
        if (this.user.$gender == 'male') {
          this.user.gender = this.user.$genderList[0];
        } else if (this.user.$gender == 'female') {
          this.user.gender = this.user.$genderList[1];
        }
      } else if (type == 'address') {
        if (this.user.profile.main_address.$country) {
          this.user.profile.main_address.country = this.countries_list.find(
            (a) => a.id == Number(this.user.profile.main_address.$country)
          );
        }
        if (this.user.profile.main_address.$gov) {
          this.user.profile.main_address.gov = this.goves_list.find(
            (a) => a.id == Number(this.user.profile.main_address.$gov)
          );
        }
        if (this.user.profile.main_address.$city) {
          this.user.profile.main_address.city = this.cities_list.find(
            (a) => a.id == Number(this.user.profile.main_address.$city)
          );
        }
        if (this.user.profile.main_address.$area) {
          this.user.profile.main_address.area = this.areas_list.find(
            (a) => a.id == Number(this.user.profile.main_address.$area)
          );
        }
      }
      this.isite
        .api({
          url: '/api/manage_user/update_personal_info',
          body: { user: this.user, type: type },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.isite.getUserSession(() => {
              this.router.navigateByUrl('/user-manage', { replaceUrl: true });
            });
            /* this.user = res.doc;
            this.user.profile.$cover =
              this.isite.baseURL + this.user.profile.cover;
            this.user.profile.$image_url =
              this.isite.baseURL + this.user.profile.image_url; */
          } else {
            this.user.$error = res.error;
          }
        });
    }
  }

  async deleteAd(id) {
    const alert = await this.alertController.create({
      header: 'تأكيد حذف الإعلان',
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
                url: '/api/contents/delete',
                body: { id: id },
              })
              .subscribe((res: any) => {
                if (res.done) {
                  this.loadMyAds();
                } else {
                }
              });
          },
        },
      ],
    });
    await alert.present();
  }

  loadMyAds() {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.isite
        .api({
          url: '/api/contents/all',
          body: {
            where: {
              $and: [
                {
                  'store.user.id': this.isite.db.userSession.id,
                },
              ],
            },
            post: true,
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.list.forEach((ad) => {
              ad.image_url = this.isite.baseURL + ad.image_url;
              ad.address = ad.address || {};
              ad.address = {
                detailed_address: ad.address.detailed_address || '',
                country: ad.address.country || {
                  name_ar: '',
                  name_en: '',
                  id: 0,
                },
                gov: ad.address.gov || { name_ar: '', name_en: '', id: 0 },
                city: ad.address.city || { name_ar: '', name_en: '', id: 0 },
                area: ad.address.area || { name_ar: '', name_en: '', id: 0 },
              };
              if (ad.quantity_list) {
                ad.quantity_list.forEach((_c) => {
                  _c.net_value = _c.net_value || 0;
                  _c.currency = _c.currency || {};
                  _c.price = _c.price || 0;
                  _c.unit = _c.unit || {};
                  _c.discount = _c.discount || 0;
                  _c.discount_type = _c.discount_type || '';
                });
              }
            });

            this.contentList = res.list;
          }
        });
    }
  }

  getCountries() {
    this.isite
      .api({
        url: '/api/countries/all',
        body: {
          where: { active: true },
          select: {
            id: 1,
            name_ar: 1,
            name_en: 1,
            image_url: 1,
            country_code: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.list.forEach((_c) => {
            _c.image_url = this.isite.baseURL + _c.image_url;
          });
          this.countries_list = res.list;
        }
      });
  }
  getGoves(country) {
    this.isite
      .api({
        url: '/api/goves/all',
        body: {
          where: { active: true, 'country.id': Number(country) },
          select: { id: 1, name_ar: 1, name_en: 1, image_url: 1 },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.list.forEach((_c) => {
            _c.image_url = this.isite.baseURL + _c.image_url;
          });
          this.goves_list = res.list;
        }
      });
  }
  getCities(gov) {
    this.isite
      .api({
        url: '/api/city/all',
        body: {
          where: { active: true, 'gov.id': Number(gov) },
          select: { id: 1, name_ar: 1, name_en: 1, image_url: 1 },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.list.forEach((_c) => {
            _c.image_url = this.isite.baseURL + _c.image_url;
          });
          this.cities_list = res.list;
        }
      });
  }

  getAreas(city) {
    this.isite
      .api({
        url: '/api/area/all',
        body: {
          where: { active: true, 'city.id': Number(city) },
          select: { id: 1, name_ar: 1, name_en: 1, image_url: 1 },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.list.forEach((_c) => {
            _c.image_url = this.isite.baseURL + _c.image_url;
          });
          this.areas_list = res.list;
        }
      });
  }

  addMobilesList() {
    if (this.user.$other_mobile) {
      this.user.mobile_list = this.user.mobile_list || [];
      this.user.mobile_list.push(this.user.$other_mobile);
      this.user.$other_mobile = '';
    }
  }
}
export interface content {
  id: number;
  image_url: string;
  name: string;
  address: any;
  set_price: string;
  quantity_list: any[];
  $time: string;
}
export interface user {
  id: number;
  $busy: boolean;
  email: string;
  name: string;
  $error: string;
  $gender: string;
  last_name: string;
  $current_password: string;
  $new_password: string;
  $re_password: string;
  mobile: string;
  profile: any;
  $personal: boolean;
  $password: boolean;
  $myAds: boolean;
  $address: boolean;
  $other_mobile: string;
  $mobile: boolean;
  $genderList: any[];
  mobile_list : any[];
  gender: any;
}
export interface countries_list {
  id: number;
  image_url: string;
  country_code: string;
  name_ar: string;
  name_en: string;
}

export interface goves_list {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
}
export interface cities_list {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
}
export interface areas_list {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
}
