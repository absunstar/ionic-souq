import { Injectable } from '@angular/core';
import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  setting: setting;
  list: [];
  constructor(public photoService: PhotoService) {
    this.setting = {
      site_name: '',
      logo: '../assets/images/logo.png',
    };
  }
}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

export interface setting {
  site_name: string;
  logo: string;
}
