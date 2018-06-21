import { Firebase } from '@ionic-native/firebase';
import { Keyboard } from '@ionic-native/keyboard';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { InboxMessageService } from './../services/inboxMessage.service';
import { TermConditionsPage } from '../pages/term-conditions/term-conditions';
import { Observable } from 'rxjs';
import { VersionChecker } from './../framework/utilities/version-checker';
import { Component, ViewChild, Injector } from '@angular/core';
import { Nav, Platform, NavController, Loading, LoadingController, AlertController, ModalController, Events, NavOptions, MenuController, ToastController, Alert } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
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
import { Badge } from '@ionic-native/badge';
import { CouponService } from '../services/coupon.service';
import { Coupon } from '../data/coupon';
import { QueuingService } from '../services/queuing.service';
import { MessageListPage } from '../pages/message-list/message-list';
import { MemberUserDetailPage } from '../pages/member-user-detail/member-user-detail';
import { LoginPage } from '../pages/login/login';
import { QueuingListPage } from '../pages/queuing-list/queuing-list';
import { QueuingShowTicketPage } from '../pages/queuing-show-ticket/queuing-show-ticket';
import { CouponPage } from '../pages/coupon/coupon';
import { PromotionListPage } from '../pages/promotion-list/promotion-list';
import { StoreListPage } from '../pages/store-list/store-list';
import { PreMemberHomePage } from '../pages/pre-member-home/pre-member-home';
import { SettingsPage } from '../pages/settings/settings';
import { PreMemberIntroPage } from '../pages/pre-member-intro/pre-member-intro';
import { PopupBannerPage } from '../pages/popup-banner/popup-banner';

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
  messageCount: number = 0;
  couponConut = 0;
  pendingListTicket: boolean = false;
  isOther: boolean = false;
  isIphoneX: boolean = false;


  constructor(public inject: Injector, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public translateService: TranslateService, public configService: ConfigService, public events: Events, public hockeyapp: HockeyApp, public deeplinks: Deeplinks, public loadingController: LoadingController, public startupService: StartupService, public appVersion: AppVersion, public alertCtrl: AlertController, public themeableBrowserService: ThemeableBrowserService, public modalCtrl: ModalController, public inboxMessageService: InboxMessageService, public userService: UserService, public badge: Badge, public couponService: CouponService, public menuCtrl: MenuController, public queuingService: QueuingService, public toastController: ToastController, public keyboard: Keyboard, public firebase: Firebase, public navCtrl: NavController) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.initHockeyApp();
      this.statusBar.styleDefault();
      this.statusBar.show();
      if (this.platform.is('ios')) {
        this.statusBar.backgroundColorByHexString('#FFC933');
      }
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#c89900');
      }
      this.setDeepLinks();
      this.hideSplash();
      this.handleEvents();
      this.callStartupData();
      this.requestMessageData();
      this.requestCoupon();
      this.translateConfig();
      this.handleKeyboard();
      this.handleOffset();
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
    this.deeplinks.routeWithNavController(this.nav, {
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
      this.nav.push(PreMemberIntroPage);
    });

    this.events.subscribe("changeLanguage", (startup) => {
      this.startup = startup;
      this.webLinks();
    });

    this.events.subscribe("requestCouponSuccess_couponCount", (couponCount) => {
      this.couponConut = couponCount;
    });

    this.events.subscribe("requestMessageSuccess_MessageCount", (MessageCount) => {
      this.messageCount = MessageCount;
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
      this.showPopupBannerAd();
    }

    if (!tmpAd) {
      this.events.publish('PopupBannerPage.onDidDismiss');
    }
  }

  showPopupBannerAd() {
    let popup = this.modalCtrl.create(PopupBannerPage);
    popup.onDidDismiss((id) => {
      
    });
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
          this.userLoginState = false;
          this.badgeMessageCount();
        }
      }, err => {
        this.userLoginState = false;
        this.badgeMessageCount();
      });
    }
  }

  badgeMessageCount() {
    let tmp = 0;
    this.inboxMessageService.unReadMsgCount().then(count => {
      let unreadMessages = count;
      let unreadPersonalMessages = 0;

      if (this.userLoginState) {
        this.storage.ready().then(() => {
          this.storage.get('languageMode').then(lang => {
            if (lang) {
              this.getPersonalAddLang(unreadPersonalMessages, unreadMessages, lang);
            } else {
              this.getPersonalAddLang(unreadPersonalMessages, unreadMessages, null);
            }
          });
        });
      } else {
        this.messageCount = unreadMessages;
        this.handleBadge(this.messageCount);
        this.events.publish('requestMessageSuccess_MessageCount_fromApp', this.messageCount);
      }
    });
  }

  judgeUserLogin(): Promise<any> {
    return this.storage.get('jcr.user');
  }

  getPersonalAddLang(unreadPersonalMsg, unreadMsg, lang) {
    this.userService.getPersonalMessage(lang).subscribe(personalNotices => {
      if (personalNotices.length > 0) {
        let Ptmp = 0;
        personalNotices.forEach(personalNotice => {
          if (personalNotice.ReadStatus == 'U') {
            Ptmp++;
          }
        });
        unreadPersonalMsg = Ptmp;
      }
      this.messageCount = Number(unreadMsg) + Number(unreadPersonalMsg);
      this.handleBadge(this.messageCount);

      this.events.publish('requestMessageSuccess_MessageConut_fromApp', this.messageCount);
    }, err => {
      this.messageCount = unreadMsg
      this.handleBadge(this.messageCount);
      this.events.publish('requestMessageSuccess_MessageConut_fromApp', this.messageCount);
    });

  }

  handleBadge(messageCount: number) {
    if (messageCount > 0) {
      this.badge.get().then(number => {
        if (number != messageCount) {
          this.badge.set(messageCount);
        }
      }, err => {
        console.log('handleBadgeErr:', err);

      });
    } else {
      this.badge.clear();
    }
  }

  requestCoupon() {
    if (this.userService.memberState == 1) {
      this.couponService.getCoupons().subscribe(coupons => {
        if (coupons) {
          this.handleCouponsCount(coupons);
        }
      }, err => {
        console.log('getCoupons Err:', err);

      });
    } else {
      this.storage.get('jcr.user').then(member => {
        if (member) {
          this.couponService.getCoupons().subscribe(coupons => {
            if (coupons) {
              this.handleCouponsCount(coupons);
            }
          }, err => {
            console.log(err);

          });
        }
      });
    }
  }

  handleCouponsCount(coupon: Coupon[]) {
    if (coupon.length > 0) {
      let tmpCoupon = [];
      coupon.forEach(coupon => {
        if (!coupon.extra) {
          this.couponConut = 0;
          this.events.publish('couponCount_fromApp', this.couponConut);
        } else if (coupon.extra.CouponStatus == 'A') {
          tmpCoupon.push(coupon);
        }
      });
      this.couponConut = tmpCoupon.length;
    }
    this.events.publish('couponConut_fromApp', this.couponConut);
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

  handleKeyboard() {
    if (this.platform.is('ios')) {
      let appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]), appElHeight = appEl.clientHeight;

      this.keyboard.disableScroll(true);

      window.addEventListener('native.keyboardshow', e => {
        appEl.style.height = (appElHeight - (<any>e).keyboardHeight + 'px');
      });

      window.addEventListener('native.keyboardhide', () => {
        appEl.style.height = '100%';
      });

      this.keyboard.hideKeyboardAccessoryBar(false);
    }
  }

  handleOffset() {
    if (this.platform.is('ios')) {
      let height = this.platform.height();
      if (height < 812) {
        this.isOther = true;
      } else {
        this.isIphoneX = true;
      }
    }
  }


  navTo(page: string) {
    let isHomeRoot = this.nav.getByIndex(0).name == 'homeScreenPage';
    let isFirst = this.nav.getActive().isFirst();

    let navToPage = (page: any, params?: any, opts?: NavOptions, done?: () => void) => {
      this.nav.insert(1, page, params, opts, done);
      if (!isFirst) {
        this.nav.popTo(1, { direction: 'forward' });
      }
    }

    switch (page) {
      case 'main': {
        this.menuCtrl.close();
        break;
      }

      case 'message': {
        navToPage(MessageListPage);
        break;
      }

      case 'userdetail': {
        if (this.userService.memberState == 2) {
          this.showAlertsTotalCard();
        } else if (this.userService.memberState == 1) {
          navToPage(MemberUserDetailPage);
        } else {
          let loginModalPage = this.modalCtrl.create(LoginPage);
          loginModalPage.onDidDismiss(loginState => {
            if (loginState == 'toHome') {
              this.menuCtrl.close();
              return;
            }
            if (loginState) {
              navToPage(MemberUserDetailPage);
            }
          });
        }
        break;
      }


      case 'queuing': {
        let gotoQueuing = () => {
          if (!this.pendingListTicket) {
            this.pendingListTicket = true;
            this.queuingService.listUserTicket().subscribe(tickets => {
              if (tickets.length > 0) {
                navToPage(QueuingShowTicketPage, {
                  'id': tickets[0].id
                }, null, () => {
                  this.pendingListTicket = false;
                });
              } else {
                navToPage(QueuingListPage, {
                  'fromMenu': true
                }, null, () => {
                  this.pendingListTicket = false;
                });
              }
            }, err => {
              console.log(err);
              this.pendingListTicket = false;
            });
          } else {
            this.toastController.create({
              message: this.translateService.instant('app.getTicketing'),
              duration: 1000,
              position: 'middle',
            }).present();
          }
        }
        if (this.userService.memberState == 2) {
          this.showAlertsTotalCard();
        } else if (this.userService.memberState == 1) {
          gotoQueuing();
        } else {
          let loginModalPage = this.modalCtrl.create(LoginPage);
          loginModalPage.onDidDismiss(loginState => {
            if (loginState == 'toHome') {
              this.menuCtrl.close();
            } else if (loginState) {
              gotoQueuing();
            }
          });
          loginModalPage.present();
        }
        break;
      }

      case "coupon":
        if (this.userService.memberState == 2) {
          this.showAlertsTotalCard();
        } else if (this.userService.memberState == 1) {
          navToPage(CouponPage);
        }
        else {
          let loginModalPage = this.modalCtrl.create(LoginPage);
          loginModalPage.onDidDismiss(loginState => {
            console.log("loginState:", loginState);

            if (loginState == "toHome") {
              this.menuCtrl.close();
              return;
            }
            if (loginState) {
              // this.nav.setPages([this.rootPage, CouponPage]);
              navToPage(CouponPage);
            }
          });
          loginModalPage.present();
        }
        break;

      case "news":
        navToPage(PromotionListPage);
        break;

      case "store":
        navToPage(StoreListPage);
        break;

      case "settings":
        navToPage(SettingsPage);
        break;

      case 'permember': {
        if (this.userService.memberState == 1) {
          this.showAlertsMember();
        } else if (this.userService.memberState == 2) {
          navToPage(PreMemberHomePage);
        } else {
          navToPage(PreMemberIntroPage);
        }
      }

      default:
        break;
    }
  }

  showAlertsTotalCard() {
    this.alertCtrl.create({
      message: this.translateService.instant('pages.homeScreen.isGenkiMember'),
      buttons: [
        {
          text: this.translateService.instant('pages.homeScreen.cancel'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('pages.homeScreen.logoutCard'),
          handler: () => {
            this.userService.logoutPreMember();
          }
        }
      ],
    }).setCssClass('PrememberAlert_UpperAndLowerDisplay').present();
  }

  showAlertsMember() {
    this.alertCtrl.create({
      message: this.translateService.instant('pages.homeScreen.isPreMember'),
      buttons: [
        {
          text: this.translateService.instant('pages.homeScreen.cancel'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('pages.homeScreen.logoutMember'),
          handler: () => {
            this.userService.logoutUser();
            this.navTo("premember");
          }
        }
      ],
    }).setCssClass('PrememberAlert_UpperAndLowerDisplay').present();
  }

  inappbrowser(webName: string, title: string, transitionStyle: string) {
    var url;
    var titleName = this.translateService.instant(title);
    if (webName == 'menu') {
      url = this.webMenu;
    }

    this.themeableBrowserService.createThemeableBrowser(url, '_blank');
  }

  external_inappbrowser(webName: string, title: string, transitionStyle: string) {
    var url: string;
    let urlObject: URL;
    var titleName = this.translateService.instant(title);

    if (webName == 'takeOut') {
      url = this.webTakeOut;
      urlObject = new URL(this.webTakeOut);
      let sid = this.configService.getSessionId();
      if (this.userService.memberState == 1) {

        if (!!urlObject.searchParams) {
          urlObject.searchParams.set('app', sid);
          url = urlObject.toString();
        } else {

          if (url.indexOf('?') > -1) {
            if (url.indexOf('app=') == -1) {
              url = url + '&app=' + encodeURIComponent(sid);
            }

          } else {
            url = url + '?app=' + encodeURIComponent(sid);
          }

        }

      } else {

        if (!!urlObject.searchParams) {
          urlObject.searchParams.set('type', 'guest');
          url = urlObject.toString();
        } else {

          if (url.indexOf('?') > -1) {

            if (url.indexOf('&type=') == -1) {
              url += '&type=guest';
            }
          } else {
            url += '?type=guest';
          }

        }
      }

      this.themeableBrowserService.settingValue(titleName, null, null, null, transitionStyle);
    }

    this.themeableBrowserService.settingValue(titleName, null, null, null, transitionStyle);

    try {
      (<any>window).cordova.ThemeableBrowser.setJSInterface("NotSetJSInterface", "NotSetJSInterface");
    } catch (error) {
      console.log(error);

    }

    this.themeableBrowserService.createThemeableBrowser(url, '_system');
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
