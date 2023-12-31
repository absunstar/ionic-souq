import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notific',
  templateUrl: './notific.page.html',
  styleUrls: ['./notific.page.scss'],
})
export class NotificPage implements OnInit {
  notificSettingModal: false;
  notificList: [notif];
  user: user;

  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loadNotific();
  }

  ngOnInit() {}

  async deleteNotific() {
    const alert = await this.alertController.create({
      header: 'تأكيد حذف الإشعارات',
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
            if (this.isite.db.userSession && this.isite.db.userSession.id) {
              this.isite
                .api({
                  url: '/api/notific/delete_for_user',
                })
                .subscribe((res: any) => {
                  if (res.done) {
                    this.loadNotific();
                  }
                });
            }
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  getUser() {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.isite
        .api({
          url: '/api/user/view',
          body: { id: this.isite.db.userSession.id },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.user = res.doc;
            this.user.notific_setting = this.user.notific_setting || {
              instant_alerts: true,
              ads_members_follow: true,
              ads_sections_followed: true,
              ads_searches_followed: true,
              replies_ads_followed: true,
              comments_my_ads: true,
            };
          }
        });
    }
  }

  setOpen(type) {
    this.notificSettingModal = type;
  }

  updateNotific(notific) {
    this.isite
      .api({
        url: '/api/notific/show',
        body: notific,
      })
      .subscribe((res: any) => {
        if (res.done) {
          if (notific.type == 'comments_my_ads') {
            this.router.navigate(['/content-details'], {
              queryParams: { id: notific.action.id, name: notific.action.name },
            });
          } else if (notific.type == 'private_messages') {
            this.router.navigateByUrl('/message', { replaceUrl: true });
          } else if (notific.type == 'replies_ads_followed') {
            this.router.navigate(['/content-details'], {
              queryParams: { id: notific.action.id, name: notific.action.name },
            });
          }  else if (notific.type == 'ads_members_follow') {
            this.router.navigate(['/content-details'], {
              queryParams: { id: notific.action.id, name: notific.action.name },
            });
          }
        }
      });
  }
  saveNotificSetting() {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.isite
        .api({
          url: '/api/manage_user/update_personal_info',
          body: { user: this.user, type: 'notific_setting' },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.setOpen(false);
          }
        });
    }
  }
  loadNotific() {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.isite
        .api({
          url: '/api/notific/all',
          body: {
            where: {
              'user.id': this.isite.db.userSession.id,
            },
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.notificList = res.list;
          }
        });
    }
  }
}
export interface notif {
  id: number;
  action: any;
  user_action: any;
  type: string;
  image_url: string;
  name: string;
  show: boolean;
  $time: string;
}

export interface user {
  id: number;
  $busy: boolean;
  email: string;
  name: string;
  last_name: string;
  mobile: string;
  $mobile: string;
  profile: any;
  notific_setting: any;
}
