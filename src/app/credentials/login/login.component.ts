import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthCredentials, CookieIdentity } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from 'src/app/models/config.models';
import { CrudService } from '../../services/crud.service';
import { CookieService } from 'ngx-cookie-service';
import { COOKIE_NAME } from '../../models/config.models';
import { AppStateService } from '../../services/app-state.service';
import { AppStateModel } from 'src/app/models/state.model';
import { UPDATE_USER } from 'src/app/models/action.model';
import { Router } from '@angular/router';
import { LogoutService } from '../logout.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentState: AppStateModel;

  constructor(
    private CrudService: CrudService,
    private cookieService: CookieService,
    private appStateService: AppStateService,
    private router: Router,
    private logout: LogoutService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.CrudService.post(ROUTES_MODEL_CONFIG.login, form.value).subscribe((credentials: AuthCredentials) => {
      console.log(credentials);

      if (credentials.token) {

        /* If accidentaly COOKIE_NAME is not deleted at logout , delete this before set a new one */
        if (this.cookieService.check(COOKIE_NAME)) {
          this.cookieService.delete(COOKIE_NAME, '/');
        }

        /* set new cookie identity */
        let cookieData: CookieIdentity = {};
        if (credentials.identity) {
          cookieData.token = credentials.token;
          /* user id */
          cookieData.dx = credentials.identity.id + 123456;
          /* cookie data created */
          cookieData.dlg = new Date().getTime();
        }
        console.log(cookieData);
        /* set cookie */
        this.cookieService.set(COOKIE_NAME, JSON.stringify(cookieData));

        /* set user in state */
        this.appStateService.setAppState({ ...this.appStateService.getAppState(), user: credentials.identity, isLogged: true });

        this.appStateService.appStateOnChange.next({ ...this.appStateService.getAppState(), action: UPDATE_USER })
        
        /* Redirect by role */
        if (credentials.identity.role.level == 30) {
          this.router.navigate(['/main']);
        } else if (credentials.identity.role.level <= 20) {
          this.router.navigate(['/main']);
        } else {
          this.logout.logout();
        }

      } else {
        this.logout.logout();
      }

    }, (error) => {
      this.router.navigate(['/message', { message: 'Login failed !' }]);
    })

  }

}
