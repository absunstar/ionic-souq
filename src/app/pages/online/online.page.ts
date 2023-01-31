import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-online',
  templateUrl: './online.page.html',
  styleUrls: ['./online.page.scss'],
})
export class OnlinePage implements OnInit {
  constructor(public isite: IsiteService, private iab: InAppBrowser) {
    this.openOnlineSite();
  }

  ngOnInit() {}
  openOnlineSite() {
    let ii = setInterval(() => {
      if (this.isite.accessToken) {
        clearInterval(ii);
        this.iab.create(
          this.isite.baseURL + '?access_token=' + this.isite.accessToken,
          '_self',
          {
            location: 'no', //Or 'no'
            hidden: 'no', //Or  'yes'
            clearcache: 'no',
            clearsessioncache: 'no',
            zoom: 'no', //Android only ,shows browser zoom controls
            hardwareback: 'yes',
            mediaPlaybackRequiresUserAction: 'no',
            shouldPauseOnSuspend: 'no', //Android only
            closebuttoncaption: 'Close', //iOS only
            disallowoverscroll: 'no', //iOS only
            toolbar: 'no', //iOS only
            enableViewportScale: 'no', //iOS only
            allowInlineMediaPlayback: 'no', //iOS only
            presentationstyle: 'pagesheet', //iOS only
            fullscreen: 'yes', //Windows only
          }
        );
      }
    }, 100);
  }
}
