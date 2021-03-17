import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProducerModel } from 'src/app/models/app.model';
import { AppStateModel } from 'src/app/models/state.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { CrudService } from 'src/app/services/crud.service';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import {UPDATE_PRODUCTS_PRODUCERS} from '../../models/action.model';


@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss']
})
export class MainviewComponent implements OnInit, OnDestroy {

  productSubscription: Subscription;
  producerSubscription: Subscription;

  currentAppstate: AppStateModel;

  constructor(private crudService: CrudService, private appStateService: AppStateService) { }

  ngOnInit(): void {
    console.log("Mainview component onInit");
   

    /* Set products in appState */
    this.productSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.products).subscribe((items: Array<ProducerModel>) => {
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.setAppState({...this.currentAppstate, products:items});
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.appStateOnChange.next({...this.currentAppstate, action:UPDATE_PRODUCTS_PRODUCERS});
      debugger;
    })

    /* Set producers in appState */
    this.producerSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.producers).subscribe((items: Array<ProducerModel>) => {
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.setAppState({...this.currentAppstate, producers:items});
      this.currentAppstate = this.appStateService.getAppState();
      this.appStateService.appStateOnChange.next({...this.currentAppstate, action:UPDATE_PRODUCTS_PRODUCERS});
    })

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
