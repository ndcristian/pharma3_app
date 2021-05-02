import { Component } from '@angular/core';
import { AppStateModel } from '../app/models/state.model';
import { AppStateService } from './services/app-state.service';
import { CookieService } from 'ngx-cookie-service';
import { COOKIE_NAME} from './models/config.models';
import * as moment from 'moment';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentState: AppStateModel;
  constructor(private appstateService: AppStateService, private cookieService: CookieService) { }

  ngOnInit() {
    console.log("------AppComponent OnInit");
    this.currentState = this.appstateService.getAppState();
    let isUserLogged = false;
    if (this.cookieService.check(COOKIE_NAME)) {
      isUserLogged = true;
    }
    // let curentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    let curentDate: Date = moment().toDate();
    let before30Date = moment().subtract(30, 'days').toDate();
    console.log(curentDate, before30Date);
    this.appstateService.setAppState({ ... this.currentState, isLogged:isUserLogged, currentDate: curentDate, before30Date: before30Date });
  }
}

