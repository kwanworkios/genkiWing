import { InboxMessageService } from './../services/inboxMessage.service';
import { TermConditionsPage } from '../pages/term-conditions/term-conditions';
import { Observable } from 'rxjs';
import { VersionChecker } from './../framework/utilities/version-checker';
import { Component, ViewChild, Injector } from '@angular/core';
import { Nav, Platform, NavController, Loading, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { GoogleMapsLoader } from '../services/map-loader.service';
import { BasePage } from '../framework/base/base-page';
import { ConfigService } from '../framework/services/config.service';
import { HockeyApp } from 'ionic-hockeyapp';
import { Deeplinks } from '@ionic-native/deeplinks';
import { StartupService } from '../services/startup.service';
import { AppVersion } from '@ionic-native/app-version';
import { ThemeableBrowserService } from '../services/themeableBrowser.service';
import { Startup } from '../data/startup';
import { UserService } from '../services/user.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('content') content: any;

  rootPage: any = HomePage;
  private loader: Loading;
  startup: any;
  webMenu: string;
  webTakeOut: string;
  isUpdateAlertShowing: boolean;
  userLoginState = false;

  constructor(public inject: Injector, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public translateService: TranslateService, public configService: ConfigService, public events: Events, public hockeyapp: HockeyApp, public deeplinks: Deeplinks, public navController: NavController, public loadingController: LoadingController, public startupService: StartupService, public appVersion: AppVersion, public alertCtrl: AlertController, public themeableBrowserService: ThemeableBrowserService, public modalCtrl: ModalController, public inboxMessageService: InboxMessageService, public userService: UserService) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.initHockeyApp();
      this.statusBar.styleDefault();
      this.statusBar.show();
      this.setDeepLinks();
      this.hideSplash();
      this.handleEvents();
      this.callStartupData();
      this.requestMessageData();
      this.requestCoupon();
      this.translateConfig();
    });
  }

  initHockeyApp() {
    let androidAppId = this.configService.config.default.hockeyapp_appid_android;
    let iosAppId = this.configService.config.default.hockeyapp_appid_ios;
    let autoSendCrashReports = true;
    let ignoreCrashDialog = false;

    this.hockeyapp.start(androidAppId, iosAppId, autoSendCrashReports, ignoreCrashDialog).then((success) => {
      console.log('hockeyapp start success');
    }, (reject) => {
      console.log("hockeyapp start reject", reject);
    }).catch((err) => {
      console.log("hockeyapp start error", err);
    });
  }

  setDeepLinks() {
    this.deeplinks.routeWithNavController(this.navController, {
      // '/settings': SettingsPage,
    }).subscribe((match) => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      console.log('Successfully matched route', match);
    }, (nomatch) => {
      // nomatch.$link - the full link data
      console.log('Got a deeplink that didn\'t match', nomatch);
    });
  }

  hideSplash() {
    if (this.splashScreen) {
      try {
        setTimeout(() => {
          this.splashScreen.hide();
        }, 2000);
      } catch (e) {
        console.log("splashScreen.hide error, err:", e);
      }
    }
  }

  handleEvents() {
    this.events.subscribe("changeMessageCount", () => {

    });

    this.events.subscribe("gotoPreMember", () => {

    });

    this.events.subscribe("changeLanguage", (startup) => {

    });

    this.events.subscribe("requestCouponSuccess_couponCount", (couponCount) => {

    });

    this.events.subscribe("requestMessageSuccess_MessageCount", (MessageCount) => {

    });
  }

  callStartupData() {
    this.loading(true);
    this.storage.ready().then(() => {
      this.storage.get('languageMode').then((lang) => {
        let startupObservable: Observable<Startup>;
        if (lang) {
          startupObservable = this.startupService.getStartup(lang);
        } else {
          startupObservable = this.startupService.getStartup();
        }
        startupObservable.subscribe((startup) => {
          this.loading(false);
          this.startupService.saveStartup(startup);
          this.webLinks();
          // this.events.publish('loadedStartUpdata', startup);
          this.showVersionCheckAlert(startup);
        }, err => {
          this.loading(false);
          this.showTermsModal(err);
        });
      }).catch(err => {
        this.loading(false);
      });
    }).catch(err => {
      this.loading(false);
    });
  }

  webLinks() {
    if (this.startupService.getLocalStartup()) {
      this.startup = this.startupService.getLocalStartup();
      this.webMenu = this.startup['group']['brands'][0]['links']['menu']['url'];
      this.webTakeOut = this.startup['group']['brands'][0]['links']['ordering']['url'];
    } else {
      this.startupService.getStartup().subscribe((startup) => {
        this.startupService.startup = startup;
        this.startup = startup;
        this.webMenu = startup['group']['brands'][0]['links']['ordering']['url'];
        this.webTakeOut = startup['group']['brands'][0]['links']['ordering']['url'];
      });
    }
  }

  showVersionCheckAlert(startup) {
    let platformName;
    if (this.platform.is('android')) {
      platformName = 'android'
    } else if (this.platform.is('ios')) {
      platformName = 'ios';
    }
    this.startupService.getAppInfo().then((currentVersionNumber) => {
      let versionChecker: VersionChecker = new VersionChecker(currentVersionNumber, startup, platformName);

      let latestVersion = versionChecker.latestVersion;
      let updateAvailable = versionChecker.updateAvailable;
      let requireUpdate = versionChecker.updateLink;
      let updateLink = versionChecker.updateLink;
      let updateMsg = versionChecker.updateMessage;

      if (requireUpdate) {
        let forceUpgradeAlert = this.alertCtrl.create({
          message: (updateMsg == '' || !updateMsg) ? this.translateService.instant('app.forceUpgradeMessage') : updateMsg,
          buttons: [{
            text: this.translateService.instant('app.upgradeButton'),
            handler: () => {
              this.themeableBrowserService.createThemeableBrowser(updateLink, '_system');
              return false;
            }
          }],
          enableBackdropDismiss: false
        });
        let unRegBackButtonAction = this.platform.registerBackButtonAction(() => {

        }, 5);
        forceUpgradeAlert.onDidDismiss(() => {
          unRegBackButtonAction();
          this.isUpdateAlertShowing = false;
        });
        forceUpgradeAlert.present().then(() => {
          this.isUpdateAlertShowing = false;
        });
      } else if (updateAvailable) {
        let upgradeAlert = this.alertCtrl.create({
          message: (updateMsg == '' || !updateMsg) ? this.translateService.instant('app.upgradeAvailableMessage') : updateMsg,
          buttons: [{
            text: this.translateService.instant('app.cancelExit'),
            role: 'cancel',
            handler: () => {
              this.handleDateForPopupBanner(startup)
              this.showTermsModal();
            }
          }, {
            text: this.translateService.instant('app.upgradeButton'),
            handler: () => {
              this.themeableBrowserService.createThemeableBrowser(updateLink, '_system');
            }
          }],
          enableBackdropDismiss: true
        });
        upgradeAlert.onDidDismiss(() => {
          this.isUpdateAlertShowing = false;
        });
        upgradeAlert.present().then(() => {
          this.isUpdateAlertShowing = true;
        });
      } else {
        this.handleDateForPopupBanner(startup);
        this.showTermsModal();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  handleDateForPopupBanner(startup: Startup) {
    let tmpAd = null;
    if (startup) {
      if (!startup.group) return;
      if (!startup.group.brands) return;
      let ads = startup.group.brands[0].ads;

      if (ads) {
        ads.forEach((ad) => {
          if (ad.type == 'popup') {
            tmpAd = ad;
          }
        });
      }
    }
    if (tmpAd) {
      this.events.publish('PopupBannerPage.onDidDismiss');
    }
  }

  showTermsModal(err?: any) {
    Promise.all([this.storage.get('appVersion'), this.appVersion.getVersionNumber()]).then((resolves) => {
      let storageVersion = resolves[0];
      let currentVersion = resolves[1];
      if (currentVersion && storageVersion != currentVersion) {
        setTimeout(() => {
          this.openTermsModal();
        }, 200);
      } else {
        this.storage.get('isAgreeTerms').then((isAgree) => {
          if (isAgree) {
            if (err) {
              this.showAlert(err.status, this.translateService.instant('app.upgradeAvailableMessage'));
            }
          } else {
            setTimeout(() => {
              this.openTermsModal();
            }, 200);
          }
        });
      }
    });
  }

  openTermsModal() {
    let modal = this.modalCtrl.create(TermConditionsPage);
    modal.onDidDismiss(result => {
      this.openNotification();
      this.loading(false);
      let isReload = result['isReload'];
      let isAgree = result['isAgree'];
      this.handleTermsReload(isReload);
      if (isAgree) {
        this.storage.set('isAgreeTerms', true);
      }
      this.appVersion.getVersionNumber().then(versionNumber => {
        if (versionNumber) {
          this.storage.set('appVersion', versionNumber);
        }
      }).catch(err => {
        console.log(err);
      });
    });
    modal.present();
  }

  handleTermsReload(isReload: boolean) {
    if (isReload) {
      this.callStartupData();
      this.requestMessageData();
      this.requestCoupon();
    }
  }

  requestMessageData() {
    this.inboxMessageService.getGlobalNotice().subscribe(notices => {
      this.inboxMessageService.setMessage(notices);
      this.handleBadgeCount();
    }, err => {
      console.log('err:', err);

    });
  }

  handleBadgeCount() {
    if (this.userService.memberState === 1) {
      this.userLoginState = true;
      this.badgeMessageCount();
    } else {
      this.judgeUserLogin().then(user => {
        if (user) {
          this.userLoginState = true;
          this.badgeMessageCount();
        } else {
          this.userLoginState = true;
          this.badgeMessageCount();
        }
      }, err => {
        this.userLoginState = false;
        this.badgeMessageCount();
      });
    }
  }

  badgeMessageCount() {

  }

  judgeUserLogin(): Promise<any> {
    return;
  }

  requestCoupon() {

  }

  showAlert(title: string = null, message: string, buttons: any = [this.translateService.instant('app.alertButtonOK')]) {
    this.alertCtrl.create({
      title: title == null ? '' : title,
      message: message,
      buttons: buttons
    }).present();
  }

  // 為了處理 出push 之前先dismiss 其他 modal / alert
  openNotification() {
    let currentView = this.nav.getActive();
    if (currentView.component.name != 'HomePage') {
      return;
    }
    // currentView.instance.dismissExistingPopups();

    setTimeout(() => {
      // currentView.instance.openNotication();
    }, 800);
  }

  translateConfig() {
    var userLang: string;
    this.storage.get('languageMode').then((value) => {
      if (!value) {
        userLang = navigator.language.split('-')[0];
        if (userLang != 'en' && userLang != 'zh') {
          userLang = 'en';
        }
        this.storage.set('languageMode', userLang);
      } else {
        userLang = value;
      }
      this.translateService.use(userLang);
      this.configService.setLocale(userLang);
      this.translateService.setDefaultLang(userLang);
      GoogleMapsLoader.loadGoogleMapScript(userLang);
    });
  }

  loading(show) {
    console.log('loading....');
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
    if (show) {
      this.loader = this.loadingController.create();
      this.loader.present();
    }
  }
}
