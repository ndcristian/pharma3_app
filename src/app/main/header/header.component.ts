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
  userName: string = ".....";
  pos:string="......"

  showMenuComanda: boolean = false;
  showMenuAdmin: boolean = false;
  showMenuNecesar: boolean = false;
  showMenuHistory: boolean = false;
  showButtonLogin: boolean = false;
  showButtonLogout: boolean = false;

  activeMenu: string = "unselected";

  activeSubscription: Subscription;

  ngOnInit(): void {
    console.log("------HeaderComponent OnInit");

    this.userName = this.appStateService.getAppState().isLogged ? this.appStateService.getAppState().user.name : "."
    this.pos = this.appStateService.getAppState().isLogged ? this.appStateService.getAppState().user.context.name : "."

    this.showButtonLogin = !this.appStateService.getAppState().isLogged;
    this.showButtonLogout = this.appStateService.getAppState().isLogged;

    this.activeSubscription= this.appStateService.appStateOnChange.subscribe((appState: AppStateModel) => {

      if (appState.action == UPDATE_USER) {
        console.log("HeaderBar component onInit:subscribe UPDATE_USER", this.appStateService.getAppState());
        this.user = appState.user ? appState.user : { name: '.' };
        this.userName = this.user.name;
        this.pos = this.user.context.name;

        /* Show/Hide menu and buttons  */
        this.showButtonLogin = !appState.isLogged;
        this.showButtonLogout = appState.isLogged;

        this.showMenuNecesar = appState.isLogged;
        this.showMenuHistory = appState.isLogged;

        /* Show menus by user role level */
        if (appState.isLogged && appState.user.role.level <= 20) {
          this.showMenuComanda = true;

          if(appState.user.role.level <= 10){
            this.showMenuAdmin = true;
          } else{
            this.showMenuAdmin = false;
          }
        }
      }

    })
  }

  
  ngOnDestroy(): void {
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
  }

  menuOnSelect(option: string) {
    this.activeMenu = option;
    this.router.navigate([`/${option}`]);
  }


  login() {
    this.router.navigate([`/login`]);
  }

  logout() {
    this.activeMenu = "unselected";
    this.showMenuComanda = false;
    this.showMenuAdmin = false;
    this.logoutService.logout();
  }

}
