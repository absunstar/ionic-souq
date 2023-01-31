import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      Preferences.get({ key: 'intro-seen' })
        .then((result) => {
          if (result.value == 'yes') {
            resolve(true);
          } else {
            resolve(false);
            this.router.navigateByUrl('/intro', { replaceUrl: true });
          }
        })
        .catch(() => {
          reject();
        });
    });
  }
}
