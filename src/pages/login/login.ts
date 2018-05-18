import { BasePage } from './../../framework/base/base-page';
import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BasePage {

  constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
    super(injector);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
