import { Injectable } from '@angular/core';
import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  setting: setting;
  time: time;
  userSession: userSession;
  content: content;
  contentList: [content];
  constructor(public photoService: PhotoService) {

    this.setting = {
      site_name: '',
      tax_number_show: false,
      enable_sending_messages_mobile_taqnyat: false,
      show_commission_add_content: false,
      commission_value: '',
      commercial_registration_no_show: false,
      commercial_registration_no: '',
      content: {},
      tax_number: '',
      you_tube_accouunt: '',
      transfer_form_text:'',
      instagram_accouunt: '',
      twitter_accouunt: '',
      facebook_account: '',
      powered_whatsapp: '',
      clock_logo: '',
      powered_logo: '',
      show_page_register: false,
      show_page_commission: false,
      show_page_featured_ads: false,
      show_page_pay_duplicate_goods: false,
      show_page_terms_use: false,
      show_page_membership_verification: false,
      show_page_evaluation_system: false,
      show_page_discount_system: false,
      show_page_blacklist_andling: false,
      show_page_prohibited_goods_advertisements: false,
      show_page_frequently_questions: false,
      powered_title: '',
      phone: '',
      email: '',
      logo: '../assets/images/logo.png',
      commission_description: '',
      commission_main_title: '',
      commission_logo: '',
      bank_account_list : [],
      currency: {},
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
  commission_value: string;
  show_commission_add_content: boolean;
  site_name: string;
  commission_description: string;
  commission_main_title: string;
  commission_logo: string;
  show_page_register: boolean;
  show_page_commission: boolean;
  show_page_featured_ads: boolean;
  show_page_pay_duplicate_goods: boolean;
  show_page_terms_use: boolean;
  show_page_membership_verification: boolean;
  show_page_evaluation_system: boolean;
  show_page_discount_system: boolean;
  show_page_blacklist_andling: boolean;
  show_page_prohibited_goods_advertisements: boolean;
  show_page_frequently_questions: boolean;
  tax_number_show: boolean;
  enable_sending_messages_mobile_taqnyat : boolean;
  commercial_registration_no_show: boolean;
  commercial_registration_no: string;
  tax_number: string;
  you_tube_accouunt: string;
  transfer_form_text : string;
  instagram_accouunt: string;
  twitter_accouunt: string;
  facebook_account: string;
  phone: string;
  currency: any;
  bank_account_list : any[];
  content: any;
  powered_whatsapp: string;
  clock_logo: string;
  powered_logo: string;
  powered_title: string;
  email: string;
  logo: string;
}
export interface userSession {
  id: number;
  message_count: number;
  notific_count: number;
  main_address: any;
  email: string;
  name: string;
  last_name: string;
  image_url: string;
  mobile: string;
  feedback_list: any[];
}
export interface content {
  id: number;
  image_url: string;
  name: string;
  address: any;
  set_price: string;
  quantity_list: any[];
  store: any;
  $time: string;
}
