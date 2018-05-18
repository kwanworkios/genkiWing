import { BasePage } from './../../framework/base/base-page';
import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage extends BasePage {

  constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
    super(injector);
  }

}