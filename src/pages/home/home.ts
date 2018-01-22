import { BasePage } from './../../framework/base/base-page';
import { Component, Injector } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage extends BasePage {

  constructor(private injector: Injector) {
    super(injector);
  }

}