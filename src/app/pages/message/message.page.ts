import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  messagesList: [message];
  message: message;
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.getMessages();
  }

  ngOnInit() {}
  getMessages() {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.isite
        .api({
          url: '/api/messages/all',
          body: {
            where: {
              'users_list.id': this.isite.db.userSession.id,
            },
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            
            for (let i = 0; i < res.list.length; i++) {
              const element = res.list[i];
              if (element.users_list) {
                element.users_list.forEach((_u) => {
                  if (_u.image_url) {
                    _u.$image_url = this.isite.baseURL + _u.image_url;
                  }
                });
              }
            }
            this.messagesList = res.list;
          }
        });
    }
  }

  showMessage(m) {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      this.messagesList.forEach((_m) => {
        _m.$isSelected = false;
      });
      m.$isSelected = true;
      this.isite
        .api({
          url: '/api/messages/show',
          body: m,
        })
        .subscribe((res: any) => {
          if (res.done) {
            if (res.doc.users_list) {
              res.doc.users_list.forEach((_u) => {
                if (_u.image_url) {
                  _u.$image_url = this.isite.baseURL + _u.image_url;
                }
              });
            }

            this.message = res.doc;
          }
        });
    }
  }

  sendMessage(m) {
    if (this.isite.db.userSession && this.isite.db.userSession.id) {
      m.$error = '';
      if (m.$busy) {
        return;
      }
      m.$busy = true;
      if (!m.$msg_sender) {
        m.$error = 'يجب كتابة رسالة';
        return;
      }

      let user = {
        id: 0,
        name: '',
        last_name: '',
        email: '',
        image_url: '',
      };
      m.users_list.forEach((_u) => {
        if (_u.email != this.isite.db.userSession.email) {
          user = _u;
        }
      });

      let message_obj = {
        date: new Date(),
        message: m.$msg_sender,
        receiver: {
          id: user.id,
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          image_url: user.image_url,
        },
        show: false,
      };

      this.isite
        .api({
          url: '/api/messages/update',
          body: message_obj,
        })
        .subscribe((res: any) => {
          m.$busy = false;
          if (res.done) {
            if (res.doc.users_list) {
              res.doc.users_list.forEach((_u) => {
                if (_u.image_url) {
                  _u.$image_url = this.isite.baseURL + _u.image_url;
                }
              });
            }

            this.message = res.doc;
          }
        });
    }
  }
}

export interface message {
  id: number;
  $isSelected: boolean;
  $busy: boolean;
  users_list: any[];
  $new: true;
  messages_list: any[];
  $msg_sender: string;
  $error: string;
}
