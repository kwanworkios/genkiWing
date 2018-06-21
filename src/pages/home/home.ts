import { Storage } from '@ionic/storage';
import { BasePage } from './../../framework/base/base-page';
import { Component, Injector } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage extends BasePage {
  currentLang: string = 'zh';
  currentMessageid = "currentMessageid";  // personal
  currentNoticeid = "currentNoticeid";
  currentTicketId = "currentTicketId";
  pushAlert: Alert = null;
  hasPushAlert = false;
  pushType: string;

  constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, public storage: Storage) {
    super(injector);
  }

  openNotication() {
    this.firebase.onNotificationOpen().subscribe((msg) => {
      try {
        msg = JSON.parse(msg['message']);
      } catch (err) {

      }
      this.storage.ready().then(() => {
        this.storage.get('languageMode').then((lang) => {
          if (lang) {
            this.currentLang = lang;
          }
          this.handlePush(msg);
        }).catch(() => {
          this.handlePush(msg);
        });
      }).catch(() => {
        this.handlePush(msg);
      });
    }, err => {
      console.log('registerPushNotification_err_onNotificationOpen');

    });
  }

  handlePush(msg) {
    if (!msg || !msg['message']) {
      return;
    }

    let action = msg['action'];
    let messageid = msg['messageId'];
    let noticeid = msg['noticeId'];
    let fromBackground = msg['tap'];
    let ticketId = msg['ticketId'];
    let title;
    let body;

    switch (this.currentLang) {
      case 'en':
        title = msg['title-en'];
        body = msg['msg-en'];
        break;

      case 'zh':
        title = msg['title-tc'];
        body = msg['msg-tc'];
        break;

      default:
        break;
    }

    if (this.currentMessageid == messageid || this.pushAlert || this.currentNoticeid == noticeid || this.currentTicketId == ticketId) {
      return;
    }

    if (messageid) this.currentMessageid = messageid;
    if (noticeid) this.currentNoticeid = noticeid;
    if (ticketId) this.currentTicketId = ticketId;

    this.requestMessageData();

    if (fromBackground == true) {
      this.handleFromBackground(action);
      return;
    }


    // title?: string;
    // subTitle?: string;
    // message?: string;
    // cssClass?: string;
    // mode?: string;
    // inputs?: AlertInputOptions[];
    // buttons?: (AlertButton | string)[];
    // enableBackdropDismiss?: boolean;
    this.pushAlert = this.alertCtrl.create({
      title: title,
      message: body,
      // text?: string;
      // role?: string;
      // cssClass?: string;
      // handler?: (value: any) => boolean | void;
      buttons: [{
        text: 'ok',
        handler: () => {
          switch (action) {
            case 'notice':
              this.pushType = 'toGlobal';
              break;
            case 'link':
              this.pushType = 'toPrivate';
              break;
            default:
              break;
          }

          this.pushAlert.onDidDismiss((data) => {
            this.hasPushAlert = false;
            this.pushAlert = null;
            this.currentMessageid = "currentMessageid";  // personal
            this.currentNoticeid = "currentNoticeid";
            this.currentTicketId = "currentTicketId";
          });
        }
      }],
    });
    this.pushAlert.present().then(() => {
      this.hasPushAlert = true;
    })
  }

  handleFromBackground(action) {
    let currentView = this.navCtrl.getActive();

    switch (action) {
      case 'notice':
        if (currentView.component.name == 'MessageListPage') {
          return;
        }
        this.openMessage();
        break;

      case 'link':
      case 'message':
        if (currentView.component.name == 'MessageListPage') {
          return;
        }
        this.openMessage(true);
        break;

      case 'ticket':
        if (currentView.component.name == 'QueuingShowTicketPage') {
          return;
        }
        this.pushToTicketInterface();
        break;

      default:
        break;
    }
  }


}