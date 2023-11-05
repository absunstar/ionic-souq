import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [
    '../content-details/content-details.page.scss',
    './profile.page.scss',
  ],
})
export class ProfilePage implements OnInit {
  user: user;
  contentList: [content];
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.user = {
      id: 0,
      message_count: 0,
      $busy: false,
      $same_email: false,
      $is_follow: false,
      $isOnline: false,
      main_address: {},
      email: '',
      name: '',
      last_name: '',
      $last_seen: '',
      image_url: '',
      mobile: '',
      profile: {},
      feedback_list: [],
      followers_list: [],
      $created_date: '',
    };
    this.getUser();
    this.loadMyAds();
  }

  ngOnInit() {}

  getUser() {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/user/view',
          body: { id: params.id, profile: true },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.user = res.doc;
            this.user.profile.cover =
              this.isite.baseURL + this.user.profile.cover;
            this.user.profile.image_url =
              this.isite.baseURL + this.user.profile.image_url;
            if (
              this.isite.db.userSession &&
              this.user.id == this.isite.db.userSession.id
            ) {
              this.user.$same_email = true;
              this.user.$is_follow = res.follow;
            }
            this.user.feedback_list = this.user.feedback_list || [];
            this.user.followers_list = this.user.followers_list || [];
          }
        });
    });
  }

  updateFollow(user, follow) {
    if (this.user.$busy) {
      return;
    }
    this.user.$busy = true;
    this.isite
      .api({
        url: '/api/user/update_follow',
        body: { id: user.id, follow: follow },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.user.$busy = false;
          this.getUser();
        }
      });
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
                {
                  'ad_status.id': 1,
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
}

export interface user {
  id: number;
  $busy: boolean;
  message_count: number;
  $same_email: boolean;
  $is_follow: boolean;
  $isOnline: boolean;
  $last_seen: string;
  main_address: any;
  email: string;
  name: string;
  last_name: string;
  image_url: string;
  mobile: string;
  $created_date: string;
  profile: any;
  feedback_list: any[];
  followers_list: any[];
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
