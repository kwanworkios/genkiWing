import { BasePage } from './../../framework/base/base-page';
import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StoreListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-list',
  templateUrl: 'store-list.html',
})
export class StoreListPage extends BasePage {

  constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
    super(injector);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreListPage');
  }

}
