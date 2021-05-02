import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContextModel, CookieIdentity, ProducerModel, SupplierModel, UserModel } from 'src/app/models/app.model';
import { AppStateModel } from 'src/app/models/state.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { CrudService } from 'src/app/services/crud.service';
import { COOKIE_NAME, ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { UPDATE_CONTEXT, UPDATE_PRODUCTS_PRODUCERS, UPDATE_SUPPLIERS, UPDATE_USER } from '../../models/action.model';
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
  contextSubscription: Subscription;
  supplierSubscription: Subscription;

  currentAppstate: AppStateModel;

  constructor(
    private crudService: CrudService,
    private appStateService: AppStateService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    console.log("------MainviewComponent OnInit");

    if (this.cookieService.check(COOKIE_NAME)) {
      /* Set products in appState */  
      this.productSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.products).subscribe((items: Array<ProducerModel>) => {
        this.currentAppstate = this.appStateService.getAppState();
        this.appStateService.setAppState({ ...this.currentAppstate, products: items });
        this.currentAppstate = this.appStateService.getAppState();
        this.appStateService.appStateOnChange.next({ ...this.currentAppstate, action: UPDATE_PRODUCTS_PRODUCERS });
      });
  
      /* Set producers in appState */
      this.producerSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.producers).subscribe((items: Array<ProducerModel>) => {
        this.currentAppstate = this.appStateService.getAppState();
        this.appStateService.setAppState({ ...this.currentAppstate, producers: items });
        this.currentAppstate = this.appStateService.getAppState();
        this.appStateService.appStateOnChange.next({ ...this.currentAppstate, action: UPDATE_PRODUCTS_PRODUCERS });
      });

      /* Set context in appState */
      this.contextSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.contextes).subscribe((items: Array<ContextModel>) => {
        this.appStateService.setAppState({ ...this.appStateService.getAppState(), context: items });
        this.appStateService.appStateOnChange.next({ ...this.currentAppstate, action: UPDATE_CONTEXT });
      });

      /* Set suppliers in appState */
      this.contextSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.suppliers).subscribe((items: Array<SupplierModel>) => {
        this.appStateService.setAppState({ ...this.appStateService.getAppState(), supplier: items });
        this.appStateService.appStateOnChange.next({ ...this.currentAppstate, action: UPDATE_SUPPLIERS });
      })
    }



    /* If page refresh and cookie is set, check the if user in appState, else get it */

    /* Check if cookie is set */
    if (this.cookieService.check(COOKIE_NAME)) {
      let cookieObj: CookieIdentity = JSON.parse(this.cookieService.get(COOKIE_NAME));
      let dx: number = cookieObj.dx - 123456;

      /* Check if user is set in appState */
      if (!this.appStateService.getAppState().user) {
        /* If not set, get user and set it in state */
        this.userSubscription = this.crudService.getById(ROUTES_MODEL_CONFIG.users, dx).subscribe((item: UserModel) => {
          this.appStateService.setAppState({ ...this.appStateService.getAppState(), user: item, isLogged: true });
          this.appStateService.appStateOnChange.next({ ...this.appStateService.getAppState(), action: UPDATE_USER })
        });
      }

    }


  }

  ngOnDestroy(): void {
    console.log("-------MainviewComponent::ngOnDestroy ")
    if (this.productSubscription) {
      this.productSubscription.unsubscribe()
    }
    if (this.producerSubscription) {
      this.producerSubscription.unsubscribe()
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
    if (this.contextSubscription) {
      this.contextSubscription.unsubscribe()
    }
    if (this.supplierSubscription) {
      this.supplierSubscription.unsubscribe()
    }
  }



}
