import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: user;

  constructor(
    private modalCtrl: ModalController,
    public isite: IsiteService,
    private route: ActivatedRoute
  ) {
    this.user = {
      email: '',
      password: '',
      $error: '',
    };
  }
  ngOnInit() {}
  loginUser(user) {
    user.$error = '';
    if (!user.email || !user.password) {
      user.$error = 'يجب كتابة إسم المستخدم و كلمة السر';
    }
    this.isite
      .api({
        url: '/api/user/login',
        body: {
          email: user.email,
          password: user.password,
          mobile_login : true,
        },
      })
      .subscribe((resUser: any) => {
        if (resUser.done) {
          window.location.reload();
        } else {
          user.$error = resUser.error;
        }
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
export interface user {
  email: string;
  password: string;
  $error: string;
}
