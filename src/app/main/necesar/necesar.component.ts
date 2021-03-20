import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../services/crud.service';
import { NecessaryModel, ProducerModel, ProductModel } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { AppStateService } from '../../services/app-state.service';
import { AppStateModel } from 'src/app/models/state.model';
import { UPDATE_PRODUCTS_PRODUCERS } from '../../models/action.model';


@Component({
  selector: 'app-necesar',
  templateUrl: './necesar.component.html',
  styleUrls: ['./necesar.component.scss']
})
export class NecesarComponent implements OnInit, OnDestroy {

  public product: any;
  public producer: any;

  activeSubscription: Subscription;
  necessarySubscription: Subscription;

  productsList: ProducerModel[];
  producersList: ProducerModel[];

  currentAppstate: AppStateModel;

  @ViewChild('productInput', { static: true }) productInput: NgbTypeahead;
  @ViewChild('producerInput', { static: true }) producerInput: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  focus2$ = new Subject<string>();
  click2$ = new Subject<string>();


  constructor(private crudService: CrudService, private appStateService: AppStateService) { }

  ngOnInit(): void {

    console.log("NecesarComponent onInit");

    this.currentAppstate = this.appStateService.getAppState();

    /* If page refresh from CoandaComponent , appState will be undefined 
    To avoid this, make a subscription to update the appState
    */
    if (this.currentAppstate) {
      this.productsList = this.currentAppstate.products;
      this.producersList = this.currentAppstate.producers;
    }

    this.activeSubscription = this.appStateService.appStateOnChange.subscribe((appState: AppStateModel) => {
      // debugger;
      if (appState.action == UPDATE_PRODUCTS_PRODUCERS) {
        this.currentAppstate = appState;
        this.productsList = this.currentAppstate.products;
        this.producersList = this.currentAppstate.producers;
      }
    })

    /* Get necessary */
    // this.necessarySubscription = this.crudService.get(ROUTES_MODEL_CONFIG.necessariesGetByContext).subscribe((items: Array<NecessaryModel>) => {
    //   console.log(items)
    // })


  }


  ngOnDestroy(): void {
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
    if (this.necessarySubscription) {
      this.necessarySubscription.unsubscribe();
    }
  }



  searchProduct = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.productInput.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.productsList
        : this.productsList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );


  }
  formatterProduct = (x: { name: string }) => x.name;


  searchProducer = (text2$: Observable<string>) => {
    const debouncedText2$ = text2$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup2$ = this.click2$.pipe(filter(() => !this.producerInput.isPopupOpen()));
    const inputFocus$ = this.focus2$;

    return merge(debouncedText2$, inputFocus$, clicksWithClosedPopup2$).pipe(
      map(term => (term === '' ? this.producersList
        : this.producersList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  formatterProducer = (x: { name: string }) => x.name;

  addProduct() {
    console.log(this.producer, this.product);
  }


}
