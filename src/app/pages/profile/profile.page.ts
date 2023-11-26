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
  rateModal: boolean = false;
  connectModal: boolean = false;
  messageModal: boolean = false;
  showRate: boolean = false;
  showAds: boolean = false;
  message: string;
  userMessage: any;
  user: user;
  contentList: [content];
  ratingList: [rating];
  rating: rating;
  positive: number = 0;
  negative: number = 0;
  rate: number = 0;
  exist_user: boolean = false;
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.connectModal = false;
    this.messageModal = false;
    this.rateModal = false;
    this.showRate = false;
    this.showAds = false;
    this.message = '';
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
      $mobile: '',
      profile: {},
      mobile_list: [],
      feedback_list: [],
      followers_list: [],
      $created_date: '',
    };
    this.rating = {
      id: 0,
      $error: '',
      notes: '',
      receiver: {},
      recommend: '',
      sender: {},
      buy: '',
      $busy: false,
      date: new Date(),
    };
    this.userMessage = {
      id: 0,
      name: '',
      last_name: '',
      image_url: '',
      email: '',
    };
    this.getUser();
    this.getRatingList();
  }

  ngOnInit() {}

  addRating() {
    if (this.rating.$busy) {
      return;
    }
    this.rating.$busy = true;
    this.rating.receiver = {
      id: this.user.id,
      email: this.user.email,
    };
    this.isite
      .api({
        url: '/api/ratings/add',
        body: this.rating,
      })
      .subscribe((res: any) => {
        this.rating.$busy = false;
        if (res.done) {
          this.getRatingList();
          this.rating = {
            id: 0,
            $error: '',
            notes: '',
            receiver: {},
            recommend: '',
            sender: {},
            buy: '',
            $busy: false,
            date: new Date(),
          };
        } else {
          this.rating.$error = res.error;
        }
      });
  }
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
            this.user.profile.$cover =
              this.isite.baseURL + this.user.profile.cover;
            this.user.profile.$image_url =
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
            this.user.mobile_list = this.user.mobile_list || [];
            this.user.$mobile = res.doc.country_code + this.user.mobile;
            this.showAds = true;
            this.loadMyAds(this.user.id);
          }
        });
    });
  }
  getRatingList() {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/ratings/all',
          body: {
            where: {
              'receiver.id': Number(params.id),
              approval: true,
            },
            display: true,
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.ratingList = res.list;
            this.ratingList.forEach((element) => {
              element.sender.image_url =
                this.isite.baseURL + element.sender.image_url;
            });
            this.positive = res.positive;
            this.rate = (this.positive / this.ratingList.length) * 100;
            this.negative = res.negative;
            this.exist_user = res.exist_user;
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
  loadMyAds(id) {
    this.isite
      .api({
        url: '/api/contents/all',
        body: {
          where: {
            $and: [
              {
                'store.user.id': id,
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
  setOpen(type, id, user) {
    if (user) {
      this.message = '';
      this.userMessage = {
        id: user.id,
        name: user.profile.name,
        last_name: user.profile.last_name,
        image_url: user.profile.image_url,
        email: user.email,
      };
    }
    this[id] = type;
  }

  isShowOther(type) {
    if (type == 'ads') {
      this.showAds = true;
      this.showRate = false;
    } else if (type == 'rate') {
      this.showAds = false;
      this.showRate = true;
    }
  }

  sendMessage() {
    if (!this.message) {
      return;
    }
    let data = { receiver: this.userMessage, message: this.message };

    this.isite
      .api({
        url: '/api/messages/update',
        body: data,
      })
      .subscribe((resUser: any) => {
        if (resUser.done) {
          this.message = '';
          this.userMessage = {};
        }
      });
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
  $mobile: string;
  $created_date: string;
  profile: any;
  mobile_list: any[];
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
export interface rating {
  id: number;
  $error: string;
  notes: string;
  receiver: any;
  recommend: string;
  sender: any;
  buy: string;
  $busy: boolean;
  date: Date;
}
