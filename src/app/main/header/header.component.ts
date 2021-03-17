import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { AppStateModel } from '../../models/state.model';
import { AppStateService } from '../../services/app-state.service';
import { TITLE } from '../../models/config.models';
import { UserModel } from 'src/app/models/app.model';
import { UPDATE_USER } from 'src/app/models/action.model';
import { LogoutService } from '../../credentials/logout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private appStateService: AppStateService,
    private logoutService: LogoutService
  ) { }

  title: string = TITLE;
  user: UserModel;
  userName: string = "Gogu";

  activeSubscription: Subscription;

  ngOnInit(): void {
    console.log("HeaderBar component onInit", this.appStateService.getAppState());

    this.userName = this.appStateService.getAppState().user ? this.appStateService.getAppState().user.name : "."

    this.appStateService.appStateOnChange.subscribe((appState: AppStateModel) => {
      console.log("HeaderBar component onInit:subscribe", this.appStateService.getAppState());
      if (appState.action == UPDATE_USER) {
        this.user = appState.user ? appState.user : {name:'.'};
        this.userName = this.user.name;
      }

    })
  }
  ngOnDestroy(): void {
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
  }

  menuOnSelect(option: string) {
    console.log(option);
    this.router.navigate([`/${option}`]);
  }

  login() {
    this.router.navigate([`/login`]);
  }

  logout() {
    this.logoutService.logout();
  }

}
