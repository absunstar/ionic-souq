import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.page.html',
  styleUrls: ['./content-details.page.scss'],
})
export class ContentDetailsPage implements OnInit {
  content: content;

  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    this.content = {
      id: 0,
      name: '',
      image_url: '',
      date: new Date(),
    };
    setTimeout(() => {
      this.getContent();
    }, 1000);
  }

  ngOnInit() {}

  getContent() {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/contents/view',
          body: { id: params.id },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.doc.image_url = this.isite.baseURL + res.doc.image_url;
            this.content = res.doc;
          }
        });
    });
  }
}

export interface content {
  id: number;
  image_url: string;
  name: string;
  date: Date;
}
