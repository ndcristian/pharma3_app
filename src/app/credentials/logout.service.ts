import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { COOKIE_NAME } from '../models/config.models';
import {UPDATE_USER} from '../models/action.model';
import {AppStateService} from '../services/app-state.service'

@Injectable({
  providedIn: 'root'
})
export class LogoutService {


  constructor(private router: Router, private cookieService:CookieService, private appStateService:AppStateService) { }

  logout() {
      this.cookieService.delete(COOKIE_NAME,'/');
      this.appStateService.setAppState({});
      this.appStateService.appStateOnChange.next({...this.appStateService.getAppState() ,action:UPDATE_USER});
      this.router.navigate(['/message', { message: 'You are logged out' }]);
  }
}
