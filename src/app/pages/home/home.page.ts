import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(public isite: IsiteService) {}

  ngOnInit() {}

  openOnlineSite() {
    window.open(
      this.isite.baseURL + '?access_token=' + this.isite.accessToken,
      '_self'
    );
  }
}
