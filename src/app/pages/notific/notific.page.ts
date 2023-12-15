import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
@Component({
  selector: 'app-notific',
  templateUrl: './notific.page.html',
  styleUrls: ['./notific.page.scss'],
})
export class NotificPage implements OnInit {
  notificList: [notific];

  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) { 
    this.loadNotific();

  }

  ngOnInit() {
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
export interface notific {
  id: number;
  user_action : any;
  type: string;
  image_url: string;
  name: string;
  $time: string;
}