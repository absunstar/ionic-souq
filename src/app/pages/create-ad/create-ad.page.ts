import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.page.html',
  styleUrls: ['./create-ad.page.scss'],
})
export class CreateAdPage implements OnInit {
  content: content;
  category_list: [category_list];
  top_category_list: [top_category_list];

  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.content = {
      id: 0,
      name: '',
      mobile: '',
      $accept: false,
      $select_category: false,
      disable_replies_feature: false,
      $warning_message: {},
      image_url: '',
      description: '',
      code: '',
      $number_favorites: 0,
      number_views: 0,
      number_comments: 0,
      category_require_list: [],
      quantity_list: [],
      images_list: [],
      $time: '',
      set_price: '',
      comment_list: [],
      main_category: {},
      address: {
        detailed_address: '',
        country: { name_ar: '', name_en: '', id: 0 },
        gov: { name_ar: '', name_en: '', id: 0 },
        city: { name_ar: '', name_en: '', id: 0 },
        area: { name_ar: '', name_en: '', id: 0 },
      },

      date: new Date(),
    };
    this.getCategories();
  }

  ngOnInit() {}
  selectStep(c, type) {
    if (type == 'main_category') {
      this.content.main_category = c;
      this.content.$select_category = true;
    }
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
}
export interface content {
  $accept: boolean;
  $select_category: boolean;
  id: number;
  code: string;
  mobile: string;
  $number_favorites: number;
  number_views: number;
  number_comments: number;
  image_url: string;
  $time: string;
  disable_replies_feature: boolean;
  $warning_message: any;
  main_category: any;
  category_require_list: any[];
  images_list: any[];
  quantity_list: any[];
  comment_list: any[];
  address: any;
  name: string;
  description: string;
  set_price: string;
  date: Date;
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
