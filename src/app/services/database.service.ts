import { Injectable } from '@angular/core';
import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  setting: setting;
  contentList: [content];
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
export interface content {
  id: number;
  image_url: string;
  name : string;
  date : Date;
}
