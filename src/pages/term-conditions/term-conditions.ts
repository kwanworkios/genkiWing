import { StartupService } from './../../services/startup.service';
import { Storage } from '@ionic/storage';
import { BasePage } from '../../framework/base/base-page';
import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the TermConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-term-conditions',
  templateUrl: 'term-conditions.html',
})
export class TermConditionsPage extends BasePage {
  canCancelMode: boolean = false;
  isCancel: boolean = false;
  isOffline: boolean = false;
  isReload: boolean = false;
  contentUrl: string;
  agreeTerms: boolean = false;
  isAgree: boolean = false;

  @ViewChild('modalBody') modalBody: ElementRef;
  constructor(private injector: Injector, public storage: Storage, public startUpService: StartupService, public viewController: ViewController) {
    super(injector);
    let canCancel = this.navParams.get('canCancel');
    if (canCancel) {
      this.canCancelMode = canCancel;
    }
    let isCancel = this.navParams.get('isCancelButton');
    if (isCancel) {
      this.isCancel = isCancel;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermConditionsPage');
    this.getLangWithData();
  }

  getLangWithData(reload?: boolean) {
    this.loading(true);
    this.storage.ready().then(() => {
      this.storage.get('languageMode').then(lang => {
        this.loadContentApi(lang, reload);
      }).catch(err => {
        this.loading(false);
      });
    }).catch(err => {
      this.loading(false);
    });
  }
  loadContentApi(lang?: string, reload?: boolean) {
    this.startUpService.getStartup(lang).subscribe(startUp => {
      this.loading(false);
      this.startUpService.saveStartup(startUp);
      this.isOffline = false;
      if (startUp['group']['brands'][0]['links']) {
        if (this.isCancel) {
          this.isReload = false;
          this.contentUrl = startUp['group']['brands'][0]['links']['mtc']['url'];
        } else {
          if (reload) {
            this.isReload = true;
          }
          this.contentUrl = startUp['group']['brands'][0]['links']['terms']['url'];
        }

        let boxSize = this.modalBody.nativeElement.getBoundingClientRect().height;
        let iframe = document.getElementById('iframe');
        iframe.setAttribute('src', this.contentUrl);
        iframe.style.height = `${boxSize}px`;
      }
    }, err => {
      this.loading(false);
      this.isOffline = true;
    });
  }

  check() {
    if(this.isOffline == false) {
      this.agreeTerms = !this.agreeTerms;
    }
  }

  dismiss() {
    this.isAgree = true;
    let dismissData = {
      'isAgree': true,
      'isReload': this.isReload
    };
    this.viewController.dismiss(dismissData);
  }
  
  cancel() {
    if(this.canCancelMode) {
      this.viewController.dismiss();
    }
  }

  reload() {
    this.getLangWithData(true);
  }

  ionViewCanLeave(): boolean {
    let canLeave = false;
    if(this.canCancelMode) {
      canLeave = true;
    } else if(this.agreeTerms && this.isAgree) {
      canLeave = true;
    }
    return canLeave;
  }
}
