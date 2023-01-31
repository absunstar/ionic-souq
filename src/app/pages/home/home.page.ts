import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { IsiteService } from '../../services/isite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  contentList: [];

  constructor(
    public isite: IsiteService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    this.isite.openOnlineSite();
  }

  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Example header',
      subHeader: 'Example subheader',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Share',
          data: {
            action: 'share',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    let result = await actionSheet.onDidDismiss();
    let result2 = JSON.stringify(result, null, 2);
    console.log(result2);
  }
  ngOnInit() {}
  loadMore(ev: Event) {
    console.log('Load More ...');
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1000 * 5);
  }

  addContent() {
    window.open(
      this.isite.baseURL +
        '/create_content?access_token=' +
        this.isite.accessToken,
      '_self'
    );
  }
  doRefresh(event: Event) {}


}
