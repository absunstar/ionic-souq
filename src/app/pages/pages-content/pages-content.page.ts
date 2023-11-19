import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-pages-content',
  templateUrl: './pages-content.page.html',
  styleUrls: ['./pages-content.page.scss'],
})
export class PagesContentPage implements OnInit {
  page_content: page_content;
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    public http: HttpClient
  ) {
    this.page_content = {
      id: 0,
      title: '',
      url: '',
      image_url: '',
      content: '',
      description: '',
    };
    this.getPageImplement();
  }

  ngOnInit() {}

  getPageImplement() {
    this.route.queryParams.subscribe(async (params) => {

      this.isite
        .api({
          url: '/api/pages/view',
          body: {
            url: params.type,
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.page_content = res.doc;
            document.getElementById('content').innerHTML = this.page_content.content;
          }
        });
    });
  }
}
export interface page_content {
  id: number;
  title: string;
  url: string;
  image_url: string;
  content: string;
  description: string;
}
