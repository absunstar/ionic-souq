import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { LoginPage } from '../login/login.page';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  contentList: [content];

  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.loadFavorites();
  }

  ngOnInit() {}

  loadFavorites() {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.isite
        .api({
          url: '/api/contents/all',
          body: {
            where: {
              'favorite_list.user.id': this.isite.db.userSession.id,
            },
            post: true,
          },
        })
        .subscribe((res: any) => {
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

            this.contentList = res.list;
          }
        });
    }
  }

  async updateFavorite(id) {
    const alert = await this.alertController.create({
      header: 'تأكيد حذف المفضلة',
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
            let data = {
              id: id,
              feedback: { favorite: false, type: 'favorite' },
            };

            this.isite
              .api({
                url: '/api/contents/update_feedback',
                body: data,
              })
              .subscribe((res: any) => {
                if (res.done) {                  
                  this.loadFavorites();
                } else {
                  console.log(res.error);
                }
              });
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }
}
export interface content {
  id: number;
  image_url: string;
  name: string;
  address: any;
  set_price: string;
  quantity_list: any[];
  $time: string;
}
