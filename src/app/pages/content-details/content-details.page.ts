import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { LoginPage } from '../login/login.page';
import { ActionSheetController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.page.html',
  styleUrls: ['./content-details.page.scss'],
})
export class ContentDetailsPage implements OnInit {
  activity: activity;
  connectModal: false;
  content: content;
  userAd: userAd;
  userSession: userSession;
  user: user;
  category_list: [category_list];

  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {
    this.connectModal = false;
    this.content = {
      id: 0,
      name: '',
      mobile: '',
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
    this.userSession = {
      id: 0,
      name: '',
      email: '',
      last_name: '',
      image_url: '',
    };
    this.userAd = {
      id: 0,
      profile: {},
    };
    this.activity = {
      busy: false,
      favorite: false,
      follow: false,
      comment_code: '',
      $comment: '',
      $reply_comment: '',
      $error: '',
      report_type: {},
      comment_report: '',
      comment_type: {},
      comment: '',
    };
    this.user = {
      id: 0,
      profile: {},
    };
    setTimeout(() => {
      this.getContent();
    }, 1000);
    this.getUserSession();
  }

  ngOnInit() {}

  setOpen(type, id) {
    this[id] = type;
  }

  showReportReply(code) {

    let reply = document.querySelector(`#reply_${code}`);
    console.log(reply);
    if (reply) {
      /*   if (reply.style.display === "block") {
        reply.style.display = "none";
      } else {
        reply.style.display = "block";
      } */
    }
  }

  selectCategoryHeader(code) {}
  showMessage(code) {}
  showReportComment(code) {}
  getAdUser(userId) {
    this.isite
      .api({
        url: '/api/user/view',
        body: { id: userId },
      })
      .subscribe((resUser: any) => {
        if (resUser.done) {
          resUser.doc.profile.image_url =
            this.isite.baseURL + resUser.doc.profile.image_url;
          this.userAd = resUser.doc;
        }
      });
  }

  getUserSession() {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/x-api/session',
          body: {},
        })
        .subscribe((resUserSession: any) => {
          if (resUserSession.done) {

            if (resUserSession.session.user) {
              this.userSession = {
                id: resUserSession.session.user.id,
                email: resUserSession.session.user.email,
                name: resUserSession.session.user.profile.name,
                last_name: resUserSession.session.user.profile.last_name,
                image_url: resUserSession.session.user.profile.image_url,
              };
              this.userSession.image_url =
                this.isite.baseURL + this.userSession.image_url;

              this.activity.favorite =
                resUserSession.session.user.feedback_list.some(
                  (_f) =>
                    _f.type && _f.ad && _f.type.id == 2 && _f.ad.id == params.id
                );
            }
          }
        });
    });
  }

  getSetting() {
    this.isite
      .api({
        url: '/api/default_setting/get',
        body: {},
      })
      .subscribe((res: any) => {
        if (res.done) {
          if (
            res.doc.content &&
            res.doc.content.warning_message_ad_list &&
            res.doc.content.warning_message_ad_list.length > 0
          ) {
            this.content.$warning_message =
              res.doc.content.warning_message_ad_list[
                Math.floor(
                  Math.random() * res.doc.content.warning_message_ad_list.length
                )
              ];
            if (this.content.$warning_message.image_url) {
              this.content.$warning_message.image_url =
                this.isite.baseURL + this.content.$warning_message.image_url;
            }
          }
        }
      });
  }

  getCategories(main_category) {
    this.isite
      .api({
        url: '/api/main_categories/all',
        body: {
          where: {
            status: 'active',
            $or: [
              { id: main_category.id },
              {
                id: { $in: main_category.parent_list_id },
              },
            ],
          },
          select: { id: 1, name_ar: 1, name_en: 1, image_url: 1 },
        },
      })
      .subscribe((res_category_list: any) => {
        if (res_category_list.done) {
          res_category_list.list.forEach((_c) => {
            _c.image_url = this.isite.baseURL + _c.image_url;
          });
          this.category_list = res_category_list.list;
        }
      });
  }

  getContent() {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/contents/view',
          body: { id: params.id, display: true },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.doc.image_url = this.isite.baseURL + res.doc.image_url;
            res.doc.$warning_message = { name: '', image_url: '' };
            res.doc.address = res.doc.address || {};
            res.doc.address = {
              detailed_address: res.doc.address.detailed_address || '',
              country: res.doc.address.country || {
                name_ar: '',
                name_en: '',
                id: 0,
              },
              gov: res.doc.address.gov || { name_ar: '', name_en: '', id: 0 },
              city: res.doc.address.city || { name_ar: '', name_en: '', id: 0 },
              area: res.doc.address.area || { name_ar: '', name_en: '', id: 0 },
            };
            this.content = res.doc;
            this.content.$number_favorites = res.doc.number_favorites || 0;
            this.content.date = new Date(this.content.date);
            if (this.content.category_require_list) {
              this.content.category_require_list.forEach((_c) => {
                _c.image_url = this.isite.baseURL + _c.image_url;
                /* if (_c.files) {
                  _c.files.forEach((_f) => {
                    _f = this.isite.baseURL + _f;
                  });
                } */
              });
            }
            if (this.content.images_list) {
              this.content.images_list.forEach((_c) => {
                _c.image_url = this.isite.baseURL + _c.image_url;
              });
            }
            if (this.content.quantity_list) {
              this.content.quantity_list.forEach((_c) => {
                _c.net_value = _c.net_value || 0;
                _c.currency = _c.currency || {};
                _c.price = _c.price || 0;
                _c.unit = _c.unit || {};
                _c.discount = _c.discount || 0;
                _c.discount_type = _c.discount_type || '';
              });
            }

            if (this.content.comment_list) {
              this.content.comment_list.forEach((_c) => {
                _c.user.image_url = this.isite.baseURL + _c.user.image_url;
                if (_c.reply_list && _c.reply_list.length > 0) {
                  _c.reply_list.forEach((_r) => {
                    _r.user.image_url = this.isite.baseURL + _r.user.image_url;
                  });
                }
              });
            }

            this.getSetting();
            this.getAdUser(res.doc.store.user.id);
            this.getCategories(this.content.main_category);
          }
        });
    });
  }
  showReplyComment(c) {
    
    if (c.$showReply) {
      c.$showReply = false;
    } else {
      c.$showReply = true;
    }
    console.log(c);
  }

  async updateFeedback(type, other, comment) {
    if (this.activity.busy) {
      return;
    }
    if (!this.userSession || !this.userSession.id) {
      const modal = await this.modalCtrl.create({
        component: LoginPage,
        initialBreakpoint: 0.5,
      });
      await modal.present();
      return;
    }
    if (type == 'favorite') {
      if (other == 'true') {
        this.activity.favorite = true;
      } else if (other == 'false') {
        this.activity.favorite = false;
      }
    } else if (type == 'follow') {
      if (other == 'true') {
        this.activity.follow = true;
      } else if (other == 'false') {
        this.activity.follow = false;
      }
    } else if (type == 'reply_comment') {
      this.activity.comment_code = other;
      this.activity.$comment = comment.$reply_comment;
      comment.$reply_comment = '';
    } else if (
      type == 'report' ||
      type == 'report_comment' ||
      type == 'report_reply'
    ) {
      if (!this.activity.report_type || !this.activity.report_type.id) {
        this.activity.$error = 'يجب إختيار نوع البلاغ';
        return;
      }
    }

    let data = {
      id: this.content.id,
      feedback: { ...this.activity, type: type },
    };
    this.activity.busy = true;

    this.isite
      .api({
        url: '/api/contents/update_feedback',
        body: data,
      })
      .subscribe((res: any) => {
        if (res.done) {
          /* this.content = response.data.doc; */
          let newDate = new Date();
          let date = newDate.toLocaleDateString('ar-EG-u-nu-latn', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          if (type == 'comment') {
            this.content.comment_list.push({
              user: {
                name: this.userSession.name,
                id: this.userSession.id,
                last_name: this.userSession.last_name,
                image_url: this.isite.baseURL + this.userSession.image_url,
              },
              comment_type: this.activity.comment_type,
              comment: this.activity.comment,
              date: new Date(),
              $time: date,
            });

            this.activity.comment = '';
            this.content.number_comments += 1;
          } else if (type == 'reply_comment') {
            this.content.comment_list.forEach((_c, indx) => {
              if (this.activity.comment_code == _c.code) {
                _c.reply_list = _c.reply_list || [];
                _c.reply_list.push({
                  user: {
                    name: this.userSession.name,
                    last_name: this.userSession.last_name,
                    image_url: this.isite.baseURL + this.userSession.image_url,
                  },
                  comment_type: this.activity.comment_type,
                  comment: this.activity.$comment,
                  date: new Date(),
                  $time: date,
                });
              }
            });

            this.activity.$comment = '';
            this.content.number_comments += 1;
          } else if (type == 'report') {
            this.activity.report_type = {};
            this.activity.comment_report = '';
            /* getReportsTypesList(); */
            /* site.hideModal('#reportModal'); */
          } else if (type == 'report_comment') {
            this.activity.report_type = {};
            this.activity.comment_report = '';
            /* getReportsTypesList(); */
            /* site.hideModal('#reportCommentModal'); */
          } else if (type == 'report_reply') {
            this.activity.report_type = {};
            this.activity.comment_report = '';
            /* getReportsTypesList(); */
            /* site.hideModal('#reportReplyModal'); */
          } else if (type == 'favorite') {
            if (this.activity.favorite) {
              this.content.$number_favorites += 1;
            } else {
              this.content.$number_favorites -= 1;
            }
          }
        }
        this.activity.busy = false;
      });
  }
}

export interface content {
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
  /*  address: any;
   quantity_list: {
    price: number;
    currency: any;
    net_value: number;
    unit: any;
    discount_type: string;
    discount: number;
  }[]; */
  name: string;
  description: string;
  set_price: string;
  date: Date;
}

export interface address {
  detailed_address: string;
}

export interface warning_message {
  name: string;
  image_url: string;
}
export interface userAd {
  id: number;
  profile: any;
}
export interface userSession {
  id: number;
  email: string;
  name: string;
  last_name: string;
  image_url: string;
}
export interface user {
  id: number;
  profile: any;
}
export interface activity {
  busy: Boolean;
  favorite: Boolean;
  follow: Boolean;
  comment_code: string;
  $error: string;
  $comment: string;
  $reply_comment: string;
  report_type: any;
  comment_report: string;
  comment_type: any;
  comment: string;
}
export interface category_list {
  id: number;
  image_url: string;
  name_ar: string;
  name_en: string;
}