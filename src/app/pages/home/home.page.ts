import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  contentList : [];

  constructor(public isite: IsiteService) {
    this.isite.loadSetting();
    this.isite.loadPosts();
  }

  ngOnInit() {}

  openOnlineSite() {
    window.open(
      this.isite.baseURL + '?access_token=' + this.isite.accessToken,
      '_self'
    );
  }
  addContent() {
    window.open(
      this.isite.baseURL +
        '/create_content?access_token=' +
        this.isite.accessToken,
      '_self'
    );
  }
  doRefresh(event : Event){

  }
}
