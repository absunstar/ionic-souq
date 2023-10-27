import { Injectable } from '@angular/core';
import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  setting: setting;
  userSession : userSession;
  content : content;
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
export interface userSession {
  id: number;
  message_count: number;
  email: string;
  name: string;
  last_name: string;
  image_url: string;
  feedback_list: any[];

}
export interface content {
  id: number;
  image_url: string;
  name : string;
  address: any;
  set_price: string;
  quantity_list: any[];
  $time : string;
}
