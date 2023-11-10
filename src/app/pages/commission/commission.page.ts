import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.page.html',
  styleUrls: ['./commission.page.scss'],
})
export class CommissionPage implements OnInit {
  commission_due: number = 0;
  price: number = 0;
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  calc() {
    setTimeout(() => {
      this.commission_due = 0;
      this.commission_due = (this.price * 1) / 100;
      if (this.commission_due < 1) {
        this.commission_due = 0;
      }
    }, 300);
  }
}
