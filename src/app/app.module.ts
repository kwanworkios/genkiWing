import { TermConditionsPage } from './../pages/term-conditions/term-conditions';
import { FlurryAnalytics } from '@ionic-native/flurry-analytics';
import { Badge } from '@ionic-native/badge';
import { StartupService } from './../services/startup.service';
import { StoreService } from '../framework/services/store.service';
import { PaymentService } from '../framework/services/payment.service';
import { OrderService } from '../framework/services/order.service';
import { MemberService } from '../framework/services/member.service';
import { Keyboard } from '@ionic-native/keyboard';
import { AppVersion } from '@ionic-native/app-version';
import { HockeyApp } from 'ionic-hockeyapp';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Firebase } from '@ionic-native/firebase';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Network } from '@ionic-native/network';
import { ConfigService } from './../framework/services/config.service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { Http, HttpModule } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { GoogleMapsLoader } from '../services/map-loader.service';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { ThemeableBrowserService } from '../services/themeableBrowser.service';
import { InboxMessageService } from '../services/inboxMessage.service';
import { UserService } from '../services/user.service';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TermConditionsPage,
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    IonicStorageModule.forRoot(),
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: "ios",
      backButtonText: '',
      platforms: {
        ios: {
          pageTransition: 'ios-transition',
        },
        android: {
          pageTransition: 'md-transition',
        }
      },
      NavController
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TermConditionsPage,
  ],
  providers: [
    Badge,
    StatusBar,
    SplashScreen,
    ConfigService,
    Storage,
    GoogleMapsLoader,
    Network,
    GoogleAnalytics,
    Firebase,
    Deeplinks,
    ThemeableBrowser,
    ThemeableBrowserService,
    AppVersion,
    StartupService,
    HockeyApp,
    Keyboard,
    MemberService,
    OrderService,
    PaymentService,
    StoreService,
    StartupService,
    InboxMessageService,
    UserService,
    FlurryAnalytics,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
