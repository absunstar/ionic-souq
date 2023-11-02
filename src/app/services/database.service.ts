import { Injectable } from '@angular/core';
import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  setting: setting;
  time: time;
  userSession : userSession;
  content : content;
  contentList: [content];
  constructor(public photoService: PhotoService) {
    this.setting = {
      site_name: '',
      tax_number_show: false,
      commercial_registration_no_show: false,
      commercial_registration_no: '',
      tax_number: '',
      you_tube_accouunt: '',
      instagram_accouunt: '',
      twitter_accouunt: '',
      facebook_account: '',
      powered_whatsapp: '',
      powered_logo: '',
      powered_title: '',
      phone: '',
      email: '',
      logo: '../assets/images/logo.png',
    };
  }
}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
export interface time {
  time1: string;
}
export interface setting {
  site_name: string;
  tax_number_show :boolean;
  commercial_registration_no_show :boolean;
  commercial_registration_no: string;
  tax_number: string;
  you_tube_accouunt: string;
  instagram_accouunt: string;
  twitter_accouunt: string;
  facebook_account: string;
  phone: string;
  powered_whatsapp: string;
  powered_logo: string;
  powered_title: string;
  email: string;
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
  store: any;
  $time : string;
}
