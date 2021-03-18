import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CookieIdentity, ProducerModel, UserModel } from 'src/app/models/app.model';
import { AppStateModel } from 'src/app/models/state.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { CrudService } from 'src/app/services/crud.service';
import { COOKIE_NAME, ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { UPDATE_PRODUCTS_PRODUCERS, UPDATE_USER } from '../../models/action.model';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss']
})
export class MainviewComponent implements OnInit, OnDestroy {

  productSubscription: Subscription;
  producerSubscription: Subscription;
  userSubscription: Subscription;

  currentAppstate: AppStateModel;

  constructor(
    private crudService: CrudService,
    private appStateService: AppStateService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    console.log("Mainview component onInit");


    /* Set products in appState */
    this.productSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.products).subscribe((items: Array<ProducerModel>) => {
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.setAppState({ ...this.currentAppstate, products: items });
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.appStateOnChange.next({ ...this.currentAppstate, action: UPDATE_PRODUCTS_PRODUCERS });
    })

    /* Set producers in appState */
    this.producerSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.producers).subscribe((items: Array<ProducerModel>) => {
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.setAppState({ ...this.currentAppstate, producers: items });
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.appStateOnChange.next({ ...this.currentAppstate, action: UPDATE_PRODUCTS_PRODUCERS });
    })

    /* If page refresh and cookie is set, check the if user in appState, else get it */

    /* Check if cookie is set */
    if (this.cookieService.check(COOKIE_NAME)) {
      let cookieObj: CookieIdentity = JSON.parse(this.cookieService.get(COOKIE_NAME));
      let dx: number = cookieObj.dx - 123456;

      /* Check if user is set in appState */
      if (!this.appStateService.getAppState().user) {
        this.userSubscription = this.crudService.getById(ROUTES_MODEL_CONFIG.users, dx).subscribe((item:UserModel) => { 
          console.log ("MainviewComponent get user::", item);
          this.appStateService.appStateOnChange.next({...this.appStateService.getAppState(), user:item, isLogged:true, action:UPDATE_USER})
        });
      }

    }


  }

  ngOnDestroy(): void {

    if (this.productSubscription) {
      this.productSubscription.unsubscribe()
    }
    if (this.producerSubscription) {
      this.producerSubscription.unsubscribe()
    }
  }



}
