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

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  mobile_or_email: string = '';
  mailer_code: string = '';
  new_password: string = '';
  mailer: mailer;
  constructor(
    private modalCtrl: ModalController,
    public isite: IsiteService,
    private route: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public loadingCtrl: LoadingController
  ) {
    this.mailer = {
      id: 0,
      $send_code: false,
      $confirm_code: false,
      $error: '',
      type: '',
      $busy: false,
      mobile: '',
      code: '',
    };
  }

  ngOnInit() {}
  sendCode() {
    if (this.mailer.$busy) {
      return;
    }
    this.mailer.$error = '';
    this.mailer.$busy = true;

    this.isite
      .api({
        url: '/api/forget_password/send_code',
        body: { mobile_or_email: this.mobile_or_email },
      })
      .subscribe((res: any) => {
        this.mailer.$busy = false;
        if (res.done) {
          this.mailer.$send_code = true;
          this.mailer.$error = 'تم إرسال الكود';
          setTimeout(() => {
            this.mailer.$error = '';
          }, 2000);
        } else {
          this.mailer.$error = res.error;
        }
      });
  }
  checkSecretCode() {
    if (this.mailer.$busy) {
      return;
    }
    if(!this.mailer_code) {
      this.mailer.$error = 'يجب كتابة الرمز';
      return;
    }
    this.mailer.$error = '';

    this.mailer.$busy = true;

    this.isite
      .api({
        url: '/api/forget_password/check_code',
        body: { mobile_or_email: this.mobile_or_email, code: this.mailer_code },
      })
      .subscribe((res: any) => {
        this.mailer.$busy = false;
        if (res.done) {
          this.mailer.$send_code = true;
          this.mailer.$confirm_code = true;
        } else {
          this.mailer.$error = res.error;
        }
      });
  }
  resendCode() {
    if (this.mailer.$busy) {
      return;
    }

    this.mailer.$busy = true;

    this.isite
      .api({
        url: '/api/forget_password/send_code',
        body: { mobile_or_email: this.mobile_or_email },
      })
      .subscribe((res: any) => {
        this.mailer.$busy = false;
        if (res.done) {
          this.mailer = res.doc;
          this.mailer.$send_code = true;
          this.mailer.$error = 'تم إرسال الكود مرة أخرى';
          setTimeout(() => {
            this.mailer.$error = '';
          }, 2000);
        } else {
          this.mailer.$error = res.error;
        }
      });
  }
  setNewPassword() {
    if (this.mailer.$busy) {
      return;
    }
    if (!this.new_password) {
      this.mailer.$error = 'يجب كتابة كلمة سر جديدة';
      return;
    }
    this.mailer.$busy = true;

    this.isite
      .api({
        url: '/api/forget_password/new_password',
        body: { 
          mobile_or_email: this.mobile_or_email,
          new_password: this.new_password,
          code: this.mailer_code,
         },
      })
      .subscribe((res: any) => {
        this.mailer.$busy = false;
        if (res.done) {
          window.location.href = "/home";
        } else {
          this.mailer.$error = res.error;
        }
      });
  }
}

export interface mailer {
  id: number;
  type: string;
  $send_code: boolean;
  $confirm_code: boolean;
  $busy: boolean;
  $error: string;
  mobile: string;
  code: string;
}
