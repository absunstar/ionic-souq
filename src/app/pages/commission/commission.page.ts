import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { log } from 'console';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.page.html',
  styleUrls: ['./commission.page.scss'],
})
export class CommissionPage implements OnInit {
  commission: commission;

  commission_due: number = 0;
  price: number = 0;
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.commission = {
      $busy: false,
      user_name: '',
      commission_amount: 0,
      $transfer_date: '',
      transfer_date: new Date(),
      adapter_name: '',
      mobile: '',
      ad_code: '',
      $error: '',
      notes: '',
    };
    this.commission.$transfer_date = new Date().toISOString();
    
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.commission.user_name =
        this.isite.db.userSession.name + this.isite.db.userSession.last_name;
        
      this.commission.mobile = this.isite.db.userSession.mobile;
    }
  }

  ngOnInit() {
   
  }

  calc() {
    setTimeout(() => {
      this.commission_due = 0;
      this.commission_due = (this.price * 1) / 100;
      if (this.commission_due < 1) {
        this.commission_due = 0;
      }
    }, 300);
  }
  sendCommission() {
    this.commission.$error = '';
    if (this.commission.$busy) {
      return;
    }
    if (
      !this.commission.user_name ||
      !this.commission.commission_amount ||
      !this.commission.$transfer_date ||
      !this.commission.adapter_name ||
      !this.commission.mobile ||
      !this.commission.ad_code
    ) {
      this.commission.$error = 'يجب ملئ جميع الحقول';
      return;
    }
    this.commission.$busy = true;
    this.commission.transfer_date = new Date(this.commission.$transfer_date);
    this.isite
      .api({
        url: '/api/pay/add',
        body: this.commission,
      })
      .subscribe((res: any) => {
        this.commission.$busy = false;
        if (res.done) {
          this.commission = {
            $busy: false,
            user_name: '',
            commission_amount: 0,
            $transfer_date: '',
            transfer_date: new Date(),
            adapter_name: '',
            mobile: '',
            ad_code: '',
            $error: '',
            notes: '',
          };
          this.commission.$error = 'تم إرسال العمولة بنجاح';
          setTimeout(() => {
            this.commission.$error = '';
          }, 1000);
        }
      });
  }
}
export interface commission {
  $busy: boolean;
  user_name: string;
  commission_amount: number;
  $transfer_date: string;
  transfer_date: Date;
  adapter_name: string;
  mobile: string;
  ad_code: string;
  $error: string;
  notes: string;
}
