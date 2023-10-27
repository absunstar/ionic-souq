import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
 import { MenuPage } from '../menu/menu.page';
 import { IsiteService } from '../../services/isite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['../content-details/content-details.page.scss','./home.page.scss'],
  
})
export class HomePage implements OnInit {
  contentList: [];

  constructor(
    public isite: IsiteService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    // this.isite.openOnlineSite();
    setTimeout(() => {
      this.loadPosts();
    }, 1000 * 3);
  }

   async menu() {
    const modal = await this.modalCtrl.create({
      component: MenuPage,
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
        '/create_content?access-token=' +
        this.isite.accessToken,
      '_self'
    );
  }

  doRefresh(event: Event) {}

  loadPosts() {
    this.isite.api({ url: '/api/contents/all',body: { post: true } }).subscribe((res: any) => {
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
        
        this.isite.db.contentList = res.list;
        
      }
    });
  }
}
