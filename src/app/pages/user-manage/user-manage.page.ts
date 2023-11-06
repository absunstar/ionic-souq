import { Component, OnInit } from '@angular/core';
import { IsiteService } from '../../services/isite.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.page.html',
  styleUrls: ['./user-manage.page.scss'],
})
export class UserManagePage implements OnInit {
  constructor(
    public isite: IsiteService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {}
}
