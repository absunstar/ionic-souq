import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IsiteService } from '../../services/isite.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(private router: Router, public isite: IsiteService) {}

  ngOnInit() {}

  next() {
    this.slides.slideNext();
  }

  async start() {
    await Preferences.set({ key: 'intro-seen', value: 'yes' });
    this.isite.openOnlineSite();
  }

  openHomePage() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }


}
