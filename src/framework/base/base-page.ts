import { ConfigService } from '../services/config.service';
import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';
import {
    Alert,
    AlertController,
    IonicApp,
    Loading,
    LoadingController,
    MenuController,
    NavController,
    NavParams,
    Platform,
    Toast,
    Events
} from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Firebase } from '@ionic-native/firebase';
import { GoogleAnalytics } from "@ionic-native/google-analytics";


@Injectable()
export class BasePage {

    private loader: Loading;
    protected busy: boolean;
    private refresher: any;

    protected loadingController: LoadingController;
    protected alertController: AlertController;
    protected toastController: ToastController;
    protected navController: NavController;
    protected navParams: NavParams;
    protected configService: ConfigService;

    public events: Events;

    protected menuController: MenuController;
    protected app: IonicApp;
    protected platform: Platform;
    protected translateService: TranslateService;

    protected timer: any;
    protected callback: any;

    private unRegBackButton: Function;
    private network: Network;

    protected googleAnalytics: GoogleAnalytics;
    public firebaseSuper: Firebase;

    constructor(injector: Injector) {

        this.loadingController = injector.get(LoadingController);
        this.alertController = injector.get(AlertController);
        this.toastController = injector.get(ToastController);
        this.navController = injector.get(NavController);
        this.navParams = injector.get(NavParams);
        this.configService = injector.get(ConfigService);
        this.translateService = injector.get(TranslateService);
        this.googleAnalytics = injector.get(GoogleAnalytics);

        this.menuController = injector.get(MenuController);
        this.app = injector.get(IonicApp);

        this.platform = injector.get(Platform);

        this.callback = this.navParams.get("callback");
        this.events = injector.get(Events);

        this.registerBack();
    }

    //method to handle pull to refresh, use like this: <ion-refresher (ionRefresh)="baseRefresh($event)">
    baseRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.refresher = refresher;
        this.refresh();
    }

    //child should overwrite this method if refresh
    refresh() {

    }

    private registerBack() {

        this.unRegBackButton = this.platform.registerBackButtonAction(() => {

            this.handleBack();
        }, 1);
    }

    private handleBack() {
        //console.log("basepage handleBack called");
        var ionicApp = this.app;

        let activePortal = ionicApp._loadingPortal.getActive() ||
            ionicApp._overlayPortal.getActive() ||
            ionicApp._modalPortal.getActive() ||
            ionicApp._toastPortal.getActive();

        if (activePortal) {

            activePortal.dismiss();

            return;
        }

        if (this.menuController.isOpen()) {
            this.menuController.close();

            return;
        }


        if (this.navController.canGoBack()) {
            this.navController.pop();
        } else {
            // this.platform.exitApp();
            this.showConfirmExitApp("", this.translateService.instant("app.sureLeaveHint"));
        }
    }

    loading(show) {


        if (show) {

            if (this.refresher) {
                return;
            }

            // If it exists, dismiss it first , -- 2017.07.02 add
            if (this.loader) {
                this.loader.dismiss();
                this.loader = null;
            }

            this.loader = this.loadingController.create({
                //content: 'Please wait...'
            });

            this.loader.present();

        } else {

            if (this.loader) {
                this.loader.dismiss();
                this.loader = null;
            }

            if (this.refresher) {
                this.refresher.complete();
                this.refresher = null;
            }

        }

    }

    showAlert(title: string, message: string, buttons: any = [this.translateService.instant("app.alertButtonOK")]): Alert {
        let alert = this.alertController.create({
            title: title,
            message: message,
            buttons: buttons
        });
        alert.present();

        return alert;
    }

    showConfirmExitApp(title: string, message: string): Alert {
        let alert = this.alertController.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: this.translateService.instant("app.cancelExit"),
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: this.translateService.instant("app.okExit"),
                    handler: () => {
                        this.platform.exitApp();
                    }
                }
            ]

        });
        alert.present();

        return alert;
    }

    showToast(message: string): Toast {
        let toast = this.toastController.create({
            message: message,
            duration: 2000,
            position: 'top'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
        return toast;
    }

    showError(err): Alert {
        this.loading(false);
        //console.log("errerr", err);
        let message = err["_body"];
        let showMessage = !message ? this.translateService.instant("app.alertMessageDefault") : message;
        

        if (err.status == 601) {
            console.log("ignore 601 ", err);
            return null;
        }
        
        if (err.status == 0) {
            this.translateService.get("app.alertMessageNetworkError").subscribe(
                (data) => {

                    if (this.configService.isPrd()) {
                        //最后的改动  prd不显示err.status
                        return this.showAlert(null, data);
                    }
                    else {
                        return this.showAlert(err.status, data);
                    }

                }
                , (err) => {
                    console.log(err);
                }
            );
        } else if (err.status == 401 || err.status == 735 || err.status == 727) {
            
            let confirm = this.alertController.create({
                //最后的改动  prd不显示err.status
                title: this.configService.isPrd() ? null : err.status,
                message: showMessage,
                // message: this.translateService.instant("app.hintLogin"),
                // message: '你的登陆已过期, 请重新登入.',
                buttons: [
                    {
                        text: this.translateService.instant("app.okExit"),
                        handler: () => { this.events.publish('sidExpired'); }
                    }
                ],
                enableBackdropDismiss: false
            });

            confirm.present();


        } else {
            //return this.showAlert(err.status, err["_body"]);

            if (err["_body"] || err.status) {

                if (this.configService.isPrd()) {
                    //最后的改动  prd不显示err.status
                    return this.showAlert(null, showMessage);
                }
                else {
                    return this.showAlert(err.status, showMessage);
                }

            } else {

                if (err) {
                    let error = String(err);
                    //console.log('fdsfsd',error.length);
                    // let e = error.substring(6);
                    let e = error;
                    if (error.startsWith("error:")) {
                        e = error.substring(6);
                    }
                    return this.showAlert('', e);
                }

            }


        }

        return null;
    }

    showPrememberError(err): Alert {
        console.log("errerr", err);
        let message = err["_body"];
        let showMessage = !message ? this.translateService.instant("app.alertMessageDefault") : message;
        this.loading(false);

        if (err.status == 601) {
            console.log("ignore 601 ", err);
            return null;
        }
        else if (err.status == 0) {
            this.translateService.get("app.alertMessageNetworkError").subscribe(
                (data) => {

                    if (this.configService.isPrd()) {
                        //最后的改动  prd不显示err.status
                        return this.showAlert(null, data);
                    }
                    else {
                        return this.showAlert(err.status, data);
                    }

                }
                , (err) => {
                    console.log(err);
                }
            );
        } else if (err.status == 401 || err.status == 727 || err.status == 735) {

            let confirm = this.alertController.create({
                //最后的改动  prd不显示err.status
                title: this.configService.isPrd() ? null : err.status,
                message: showMessage,
                // message: this.translateService.instant("app.hintLogin"),
                // message: '你的登陆已过期, 请重新登入.',
                buttons: [
                    {
                        text: this.translateService.instant("app.okExit"),
                        handler: () => { this.events.publish('prememberSidExpired'); }
                    }
                ],
                enableBackdropDismiss: false
            });

            confirm.present();



        } else {
            //return this.showAlert(err.status, err["_body"]);

            console.log('base_body', err["_body"]);
            if (err["_body"] || err.status) {

                if (this.configService.isPrd()) {
                    //最后的改动  prd不显示err.status
                    return this.showAlert(null, showMessage);
                }
                else {
                    return this.showAlert(err.status, showMessage);
                }

            } else {

                if (err) {
                    let error = String(err);
                    //console.log('fdsfsd',error);
                    // let e = error.substring(6);
                    let e = error;
                    if (error.startsWith("error:")) {
                        e = error.substring(6);
                    }
                    return this.showAlert('', e);
                }

            }
        }

        return null;
    }

    showFacebookReject(reason): Alert {
        console.log("reason", reason);

        if (reason.errorCode == "4201" || reason == "User cancelled.") {
            // return this.showAlert("", this.translateService.instant("app.facebookLoginFailed"));
            return;
        }

        let text = "";
        text += JSON.stringify(reason);
        let errAlert = this.alertController.create({
            message: text,
            buttons: [this.translateService.instant("pages.registration.ok")],
            cssClass: "alert-counter"

        });
        errAlert.present();
        return errAlert;
    }

    protected testSetup(navParams: NavParams) {

    }

    protected getUIRefreshInterval(): number {
        return 0;
    }

    protected onRefreshUI() {
        console.log('refresh ui');
    }

    private startTimer() {
        if (!this.timer) {
            console.log('start timer');
            this.timer = setInterval(() => {
                this.onRefreshUI();
            }, this.getUIRefreshInterval());
        }
    }

    private stopTimer() {
        console.log('stop timer');
        clearInterval(this.timer);
        this.timer = null;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BasePage');
        let interval = this.getUIRefreshInterval();
        if (interval > 0) {
            this.startTimer();
        }
    }

    ionViewWillLeave() {
        console.log('ionViewWillLeave BasePage');
        let interval = this.getUIRefreshInterval();
        if (interval > 0) {
            this.stopTimer();
        }
    }

    ionViewWillUnload() {
        this.handleCallback(null);
        this.unRegBackButton();
    }

    handleCallback(result: any) {
        if (this.callback) {
            var cb = this.callback;
            this.callback = null;
            cb(result);
        }
    }

    /* 给计算 sotre.remark  加上 ()  start */
    handleRemark(remark): string {
        if (remark) {
            let v1 = remark.charAt(0);
            let v2 = remark.charAt(remark.length - 1);

            //console.log('v1', v1 + 'v2', v2);

            if (v1 == "(" && v2 == ")") {
                return remark;
            } else {

                return "(" + remark + ")";
            }
        } else {
            return "";
        }
    }
    /* 给计算 sotre.remark  加上 ()  end */


    /* 根据經緯度計算距離  start */
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    /* 根据經緯度計算距離  end */

    // 判斷類型是否是 number
    isNumber(value) {
        return typeof value === 'number';
    };

    /*  傳時間戳:number, retrun  2017-06-04  */
    formartDate(date) {

        if (!this.isNumber(date)) return date;
        if (date) {
            let dateFormat = new Date(date);
            let year = dateFormat.getFullYear();
            let month = dateFormat.getMonth() + 1;
            var monthString = String(month);
            let day = dateFormat.getDate();
            var strDateString = String(day);
            if (month >= 1 && month <= 9) {

                monthString = String("0" + String(month));
            }
            if (day >= 0 && day <= 9) {
                strDateString = String("0" + String(day));
            }
            return year + "-" + monthString + "-" + strDateString;
        }

    }
    /*  傳時間戳:number, retrun  2017-06-04  end*/

    isNetWork() {
        if (this.network.type === 'none') { //没网络
            return false;
        } else { //有网络
            return true;
        }
    }

    /* dismiss 當前存在的alert/modal start */
    public dismissExistingPopups() {
        console.log('Removing Alerts');
        let ionicApp = this.app;
        if (ionicApp._loadingPortal.getActive())
            return;
        let activePortal = /*ionicApp._loadingPortal.getActive() ||*//*Loading cannot be paused by back button*/
            ionicApp._overlayPortal.getActive() ||
            ionicApp._toastPortal.getActive() ||
            ionicApp._modalPortal.getActive();


        console.log("", activePortal);
        if (activePortal) {
            ionicApp._modalPortal.popAll();
            ionicApp._toastPortal.popAll();
            ionicApp._overlayPortal.popAll();
        }
    }
    /* dismiss 當前存在的alert/modal end */



}

