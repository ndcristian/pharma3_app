import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { COOKIE_NAME } from 'src/app/models/config.models';
import { AppStateService } from '../../services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(
    private cookieService: CookieService,
    private appStateService: AppStateService,
  ) { }


  canActivate(activeRoute: ActivatedRouteSnapshot,
    stateRoute: RouterStateSnapshot): boolean {

    let access: number;
    let activeUrl = activeRoute.url;
    let activeUrlString = stateRoute.url;
    console.log("canActivate::", access, activeUrl, activeUrlString);

    /* check if cookie exist */
    if (this.cookieService.check(COOKIE_NAME)) {

      /* check if user is in state */
      if (this.appStateService.getAppState().user) {

        access = this.appStateService.getAppState().user.role.level;

        return this.checkRouteRights(activeUrlString, access);

      } else {
        return false;
      }

    } else {
      return false;
    }
  }


  checkRouteRights(url: string, access: number) {

    if (access <= 30) {
      switch (url) {
        case "/comanda":
          return access <= 20 ? true : false;
          break;
        case "/admin":
          return access <= 10 ? true : false;
          break;
        default:
          console.log("No route match...");
          return true;
          break;
      }

    } else {
      return false;
    }
  }




}
