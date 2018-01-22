import { Injectable } from '@angular/core';
import { ThemeableBrowser, ThemeableBrowserObject, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
import { Network } from '@ionic-native/network';
import { AlertController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ThemeableBrowserService {
    private staticText = "themeableBrowser";
    private statusbarColor = '#ffc933';
    private toolbarColor = '#ffc933';
    private titleColor = '#000000';
    private transitionstyle = 'coververtical';  // fliphorizontal, crossdissolve or coververtical
    private homeButtonImage = 'none'
    private location = 'yes';
    private options: ThemeableBrowserOptions;
    constructor(private browser: ThemeableBrowser, private network: Network, public alertCtrl: AlertController, public translate: TranslateService, public platform: Platform, ) {

    }
    private setOptions() {
        this.options = {
            statusbar: {
                color: this.statusbarColor
            },
            toolbar: {
                height: 49,
                color: this.toolbarColor
            },
            title: {
                color: this.titleColor,
                staticText: this.staticText,
                showPageTitle: true,

            },
            closeButton: {
                image: 'test_back',
                imagePressed: 'test_back',
                align: 'left',
                event: 'closePressed',
            },
            customButtons: [
                {
                    image: this.homeButtonImage,
                    imagePressed: this.homeButtonImage,
                    align: 'right',
                    event: 'goHome'
                }
            ],
            backButtonCanClose: true,
            transitionstyle: this.transitionstyle,
            disableAnimation: false,
            //location: this.location,
            enableViewportScale: 'no',
        };
    }

    public settingValue(staticText?, statusbarColor?, toolbarColor?, titleColor?, transitionstyle?, homeButtonImage?, location?) {
        if (staticText) {
            this.staticText = staticText;
        }
        if (statusbarColor) {
            this.statusbarColor = statusbarColor;
        }
        if (toolbarColor) {
            this.toolbarColor = toolbarColor;
        }
        if (titleColor) {
            this.titleColor = titleColor;
        }
        if (transitionstyle) {
            this.transitionstyle = transitionstyle;
        }
        if (homeButtonImage) {
            this.homeButtonImage = homeButtonImage;
        }
        if (location) {
            this.location = location;
        }
        this.setOptions();
    }

    showErrorMsg() {
        let alert = this.alertCtrl.create({
            // subTitle: this.translate.instant("app.alertMessageNetworkError"),
            // buttons: [this.translate.instant("app.okExit")]
            subTitle: "Network Error",
            buttons: ["OK"]
        });
        alert.present();
    }

    public createThemeableBrowser(url: string, target: string): ThemeableBrowserObject {
        // this.menu.swipeEnable(false, 'appMenu');
        if (this.network.type === 'none') {
            this.showErrorMsg();
            return;
        }
        this.setOptions();
        let browser: ThemeableBrowserObject = this.browser.create(url, target, this.options);
        browser.on('exit').subscribe((sharePressed) => {
            // browser.close();
            // this.menu.swipeEnable(true, 'appMenu');
            console.log('close browser...');
            // this.menu.enable(false,'appMenu');
        });
        return browser;
    }
}