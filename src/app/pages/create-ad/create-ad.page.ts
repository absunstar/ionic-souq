import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-create-ad',
  templateUrl: './create-ad.page.html',
  styleUrls: ['./create-ad.page.scss'],
})
export class CreateAdPage implements OnInit {
  content: content;
  category_list: [category_list];
  top_category_list: [top_category_list];
  countries_list: [countries_list];
  goves_list: [goves_list];
  cities_list: [cities_list];
  areas_list: [areas_list];
  units_list: [units_list];
  currencies_list: [currencies_list];

  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    public http: HttpClient,
    public loadingCtrl: LoadingController
  ) {
    this.content = {
      id: 0,
      name: '',
      mobile: '',
      feedback_list: [],
      ad_rating: 0,
      set_price: 'no',
      number_views: 0,
      number_comments: 0,
      number_favorites: 0,
      number_reports: 0,
      priority_level: 0,
      active: true,
      $busy: false,
      $accept: false,
      $show_category: false,
      $show_choose_address: false,
      $show_address: false,
      $show_videos_link: false,
      $show_images: false,
      $show_finish: false,
      $image_details: '',
      $error: '',
      $video_link: '',
      $video_details: '',
      $country: 0,
      $gov: 0,
      $city: 0,
      $area: 0,
      ad_status: {},
      disable_replies_feature: false,
      hide_mobile: false,
      $warning_message: {},
      image_url: '',
      $image_url_main: '',
      $image_url: '',
      $image_url_list: '',
      description: '',
      code: '',
      videos_list: [],
      category_require_list: [],
      quantity_list: [],
      images_list: [],
      comment_list: [],
      main_category: {},
      address: {
        detailed_address: '',
        country: { image_url: '', name_ar: '', name_en: '', id: 0 },
        gov: { image_url: '', name_ar: '', name_en: '', id: 0 },
        city: { image_url: '', name_ar: '', name_en: '', id: 0 },
        area: { image_url: '', name_ar: '', name_en: '', id: 0 },
      },
      date: new Date(),
      expiry_date: new Date(),
    };
    this.getCategories();
    this.getCountries();
    this.getCurrencies();
    this.getUnits();
  }

  ngOnInit() {}

  async selectImage(type) {
    await Camera.checkPermissions().then((permissions) => {
      if (permissions.photos !== 'granted') {
        Camera.requestPermissions();
      }
    });
 
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
        if (type == 'list') {
          this.content.$image_url = res.image.url;
          this.content.$image_url_list = this.isite.baseURL + res.image.url;
        } else if (type == 'main') {
          this.content.image_url = res.image.url;
          this.content.$image_url_main = this.isite.baseURL + res.image.url;
        }
        /* this.user.image_url = res.image.url;
        this.user.$image_url = this.isite.baseURL + res.image.url; */
        loading.dismiss();
      });
  }
  upDownList(list, type, index) {
    let element = list[index];
    let toIndex = index;

    if (type == 'up') {
      toIndex = index - 1;
    } else if (type == 'down') {
      toIndex = index + 1;
    }

    list.splice(index, 1);
    list.splice(toIndex, 0, element);
  }
  selectStep(c, type) {
    this.content.$show_category = false;
    this.content.$show_choose_address = false;
    this.content.$show_address = false;
    this.content.$show_videos_link = false;
    this.content.$show_images = false;
    this.content.$show_finish = false;

    if (type == 'main_category') {
      this.content.main_category = c;
      this.content.$show_choose_address = true;
    } else if (type == 'accept') {
      this.content.mobile = this.isite.db.userSession.mobile;
      this.content.$accept = true;
      this.content.$show_category = true;
    } else if (type == 'choose_address') {
      this.content.$show_address = true;
      if (c == 'current') {
        if (this.isite.db.userSession.main_address) {
          if (
            this.isite.db.userSession.main_address.country &&
            this.isite.db.userSession.main_address.country.id
          ) {
            this.content.$country =
              this.isite.db.userSession.main_address.country.id.toString();
            this.getGoves(this.isite.db.userSession.main_address.country.id);
          }
          if (
            this.isite.db.userSession.main_address.gov &&
            this.isite.db.userSession.main_address.gov.id
          ) {
            this.content.$gov =
              this.isite.db.userSession.main_address.gov.id.toString();
            this.getCities(this.isite.db.userSession.main_address.gov.id);
          }
          if (
            this.isite.db.userSession.main_address.city &&
            this.isite.db.userSession.main_address.city.id
          ) {
            this.content.$city =
              this.isite.db.userSession.main_address.city.id.toString();
            this.getAreas(this.isite.db.userSession.main_address.city.id);
          }
          if (
            this.isite.db.userSession.main_address.area &&
            this.isite.db.userSession.main_address.area.id
          ) {
            this.content.$area =
              this.isite.db.userSession.main_address.area.id.toString();
          }
          if (this.isite.db.userSession.main_address.detailed_address) {
            this.content.address.detailed_address =
              this.isite.db.userSession.main_address.detailed_address;
          }
        }
      }
    } else if (type == 'done_address') {
      this.content.$show_images = true;
    } else if (type == 'done_video') {
      this.content.$show_finish = true;
    } else if (type == 'done_images_list') {
      this.content.$show_videos_link = true;
    }
  }
  addVideosLink() {
    if (this.content.$video_link) {
      this.content.videos_list.push({
        link: this.content.$video_link,
        description: this.content.$video_details || '',
      });
      this.content.$video_link = '';
      this.content.$video_details = '';
    }
  }
  addImagesLink() {
    if (this.content.$image_url) {
      this.content.images_list.push({
        image_url: this.content.$image_url,
        $image_url: this.isite.baseURL + this.content.$image_url,
        description: this.content.$image_details || '',
      });
      this.content.$image_url = '';
      this.content.$image_url_list = '';
      this.content.$image_details = '';
    }
  }
  addQuantity() {
    let obj = {
      price: 0,
      discount: 0,
      discount_type: 'number',
      net_value: 0,
      available_quantity: 0,
      maximum_order: 0,
      minimum_order: 0,
    };
    this.content.quantity_list.push(obj);
  }
  getCategories() {
    this.isite
      .api({
        url: '/api/main_categories/all',
        body: {
          where: {
            status: 'active',
          },
          select: { id: 1, name_ar: 1, name_en: 1, image_url: 1 },
          top: true,
        },
      })
      .subscribe((res_category_list: any) => {
        if (res_category_list.done) {
          res_category_list.list.forEach((_c) => {
            _c.image_url = this.isite.baseURL + _c.image_url;
          });
          res_category_list.top_list.forEach((_c) => {
            _c.image_url = this.isite.baseURL + _c.image_url;
          });
          this.category_list = res_category_list.list;
          this.top_category_list = res_category_list.top_list;
        }
      });
  }
  calcDiscount(obj) {
    setTimeout(() => {
      let discount = obj.discount || 0;
      if (obj.discount_type == 'percent')
        discount = (obj.price * obj.discount) / 100;
      obj.net_value = obj.price - discount;
    }, 250);
  }
  changeSetPrice(type) {
    if (type == 'yes') {
      this.content.quantity_list = [
        {
          price: 0,
          discount: 0,
          discount_type: 'number',
          net_value: 0,
          available_quantity: 0,
          maximum_order: 0,
          minimum_order: 0,
        },
      ];
    } else if (type == 'no') {
      this.content.quantity_list = [];
    }
  }

  addContent() {
    if (this.content.$busy) {
      return;
    }
    this.content.$busy = true;
    this.content.$error = '';
    if (!this.content.name) {
      this.content.$error = 'يجب كتابة عنوان الإعلان';
      this.content.$busy = false;
      return;
    } else if (!this.content.description) {
      this.content.$error = 'يجب كتابة تفاصيل الإعلان';
      this.content.$busy = false;
return;
    }
    if (this.content.$country) {
      this.content.address.country = this.countries_list.find(
        (a) => a.id == Number(this.content.$country)
      );
    }
    if (this.content.$gov) {
      this.content.address.gov = this.goves_list.find(
        (a) => a.id == Number(this.content.$gov)
      );
    }
    if (this.content.$city) {
      this.content.address.city = this.cities_list.find(
        (a) => a.id == Number(this.content.$city)
      );
    }
    if (this.content.$area) {
      this.content.address.area = this.areas_list.find(
        (a) => a.id == Number(this.content.$area)
      );
    }
    this.content.ad_status = this.isite.db.setting.content.status;
    this.content.expiry_date.setDate(this.content.expiry_date.getDate() + 7);
    if (this.content.quantity_list) {
      for (let i = 0; i < this.content.quantity_list.length; i++) {
        let element = this.content.quantity_list[i];
        if (element.$unit) {
          element.unit = this.units_list.find(
            (a) => a.id == Number(element.$unit)
          );
        }
        if (element.$currency) {
          element.currency = this.currencies_list.find(
            (a) => a.id == Number(element.$currency)
          );
        }
      }
    }
    this.isite
      .api({
        url: '/api/contents/add',
        body: this.content,
      })
      .subscribe((res: any) => {
        this.content.$busy = false;
        if (res.done) {
          this.isite.getUserSession(() => {
            this.router.navigateByUrl('/home', { replaceUrl: true });
          });
        }
      });
  }

  getUnits() {
    this.isite
      .api({
        url: '/api/units/all',
        body: {
          where: { active: true },
          select: {
            id: 1,
            name_ar: 1,
            name_en: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.units_list = res.list;
        }
      });
  }

  getCurrencies() {
    this.isite
      .api({
        url: '/api/currency/all',
        body: {
          where: { active: true },
          select: {
            id: 1,
            name_ar: 1,
            name_en: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.currencies_list = res.list;
        }
      });
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
}

export interface content {
  $accept: boolean;
  $show_category: boolean;
  id: number;
  ad_rating: number;
  code: string;
  mobile: string;
  $busy: boolean;
  hide_mobile: boolean;
  number_views: number;
  number_comments: number;
  number_favorites: number;
  number_reports: number;
  priority_level: number;
  active: boolean;
  $show_choose_address: boolean;
  $show_address: boolean;
  $show_videos_link: boolean;
  $show_images: boolean;
  $show_finish: boolean;
  $video_link: string;
  $video_details: string;
  $country: number;
  $gov: number;
  $city: number;
  $area: number;
  $error: string;
  image_url: string;
  $image_url: string;
  $image_url_main: string;
  $image_url_list: string;
  $image_details: string;
  ad_status: any;
  disable_replies_feature: boolean;
  $warning_message: any;
  main_category: any;
  videos_list: any[];
  category_require_list: any[];
  images_list: any[];
  quantity_list: any[];
  comment_list: any[];
  feedback_list: any[];
  address: any;
  name: string;
  description: string;
  set_price: string;
  date: Date;
  expiry_date: Date;
}
export interface category_list {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
}
export interface top_category_list {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
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
export interface units_list {
  id: number;
  name_ar: string;
  name_en: string;
}

export interface currencies_list {
  id: number;
  name_ar: string;
  name_en: string;
  ex_rate: number;
}
