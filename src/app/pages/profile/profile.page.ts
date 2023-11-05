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
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.getUser();
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
}

export interface user {
  id: number;
  message_count: number;
  $busy: boolean;
  $same_email: boolean;
  $is_follow: boolean;
  $isOnline : boolean;
  main_address: any;
  email: string;
  name: string;
  last_name: string;
  image_url: string;
  mobile: string;
  profile: any;
  feedback_list: any[];
  followers_list: any[];
}
