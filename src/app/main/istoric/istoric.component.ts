import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren, AfterViewInit, QueryList, AfterViewChecked } from '@angular/core';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ContextModel, DepositModel, ProducerModel, ProductModel, SupplierModel, NecessaryModel, OfferModel, HistoryModel, UserModel } from 'src/app/models/app.model';
import { AppStateModel } from 'src/app/models/state.model';
import { CrudService } from '../../services/crud.service';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { AppStateService } from '../../services/app-state.service';
import { UPDATE_CONTEXT, UPDATE_PRODUCTS_PRODUCERS, UPDATE_SUPPLIERS } from '../../models/action.model';
import { CrudFilter } from '../../models/app.model';
import * as moment from 'moment';

@Component({
  selector: 'app-istoric',
  templateUrl: './istoric.component.html',
  styleUrls: ['./istoric.component.scss']
})
export class IstoricComponent implements OnInit {

  public product: any;
  public producer: any;

  @ViewChild('productInput', { static: true }) productInput: NgbTypeahead;
  @ViewChild('producerInput', { static: true }) producerInput: NgbTypeahead;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  focus2$ = new Subject<string>();
  click2$ = new Subject<string>();


  productsList: ProducerModel[];
  producersList: ProducerModel[];

  productSubscription: Subscription;
  posSubscripton: Subscription;
  supplierSubscription: Subscription;
  necessarySubscription: Subscription;
  modifierDetailsSubscription: Subscription;

  historyList: DepositModel[];
  supplierList: SupplierModel[];
  contextList: ContextModel[];

  currentAppstate: AppStateModel;
  filters: { product?: ProducerModel, producer?: ProducerModel } = {};

  isCentralizat: boolean = false;
  selectedContext: ContextModel;
  selectedSupplier: SupplierModel;
  selectedHistoryRow: DepositModel;


  /* if supplier is changed, reset all discount and price noticed before */
  supplierChanged: boolean = false;


  constructor(private crudService: CrudService, private appStateService: AppStateService) { }

  ngOnInit(): void {
    console.log("ComandaComponent onInit");

    this.currentAppstate = this.appStateService.getAppState();

    /* If page refresh from CoandaComponent , appState will be undefined 
    To avoid this, make a subscription to update the appState
    */
    if (this.currentAppstate) {

      this.productsList = this.currentAppstate.products;
      this.producersList = this.currentAppstate.producers;

      /* If role admin or depozit , show all POS  */
      if (this.appStateService.getAppState().user.role.level <= 20) {
        this.contextList = this.currentAppstate.context;
      } else {
        this.contextList = this.currentAppstate.context.filter((c: ContextModel) => {
          return c.id == this.currentAppstate.user.context.id || c.central;
        });
      }

      this.supplierList = this.currentAppstate.supplier;

      /* Set selectedSupplier as default */
      this.selectedSupplier = this.supplierList.filter((s: SupplierModel) => {
        return s.implicit == true;
      })[0];

      /* Set selectedSupplier as default */
      this.selectedContext = this.contextList.filter((c: ContextModel) => {
        return c.id == this.currentAppstate.user.context.id;
      })[0];
    }

    /* Fired after login */
    this.productSubscription = this.appStateService.appStateOnChange.subscribe((appState: AppStateModel) => {

      if (appState.action == UPDATE_PRODUCTS_PRODUCERS) {
        this.currentAppstate = appState;
        this.productsList = appState.products;
        this.producersList = appState.producers;
      }

      if (appState.action == UPDATE_SUPPLIERS) {
        this.supplierList = appState.supplier;
// debugger;
        /* Set selectedSupplier as default */
        this.selectedSupplier = this.supplierList.filter((s: SupplierModel) => {
          return s.implicit == true;
        })[0];

      }


      if (appState.action == UPDATE_CONTEXT) {
        this.contextList = appState.context;

        /* Set selectedSupplier as default */
        this.selectedContext = this.contextList.filter((c: ContextModel) => {
          return c.implicit == true;
        })[0];
        
      }


      // console.log("ComandaComponent state after subscriptions==", this.appStateService.getAppState());

    });

    /* Get/update necessary data */
    this.refreshNcessaryData();
  }


  onSelectProduct(product?: ProductModel) {
    this.filters.product = product;
    this.producer = product.producer;
  }

  onSelectProductKeyPress() {
    this.filters.product = this.product;
    this.producer = this.product.producer;
  }

  onSelectProducer(producer?: ProducerModel) {
    this.filters.producer = producer;
    delete this.filters.product;
    this.product = "";
    console.log(producer);
  }

  onSelectProducerKeyPress() {
    this.filters.producer = this.producer;
    delete this.filters.product;
    this.product = "";
    console.log(this.producer);
  }

  filterData() {
    if (this.filters.product) {
      this.historyList = this.historyList.filter((n: HistoryModel) => {
        return n.product.id == this.filters.product.id;
      })
    }

    if (this.filters.producer) {
      this.historyList = this.historyList.filter((n: HistoryModel) => {
        return n.product.producer.id == this.filters.producer.id;
      })
    }
  }

  /* Filter when select a product */
  onSelectContext(item: number) {

    this.selectedContext = this.contextList.filter((c: ContextModel) => {
      return c.id == item;
    })[0];
    this.isCentralizat = this.selectedContext.central;
    this.refreshNcessaryData();
  }

  /* Filter when select a product */
  onSelectSupplier(item: SupplierModel) {
    console.log(item)
    this.supplierChanged = true;
    this.selectedSupplier = this.supplierList.filter((c: ContextModel) => {
      return c.id == item;
    })[0];

    this.refreshNcessaryData();

  }

  refreshNcessaryData() {
    /* Reset fields */
    this.producer = "";
    this.product = "";
    /* Reset filters */
    this.filters = {};

    /* Get necessary from diferent sources dependin on isCentralizat */
    let crudFilter: CrudFilter[] = [
      { proprety: "from", value: moment().subtract(30, 'days').toDate().getTime().toString() },
      { proprety: "to", value: moment().toDate().getTime().toString() },
      /* in deposit all records have 0 at context */
      { proprety: "context", value: this.isCentralizat ? '0' : this.selectedContext.id.toString() }
    ];
    if (!this.selectedSupplier.implicit) {
      crudFilter.push(
        { proprety: "supplier", value: this.selectedSupplier.id.toString() }
      );
    }


    this.necessarySubscription = this.crudService.getBy(ROUTES_MODEL_CONFIG.histories, crudFilter).subscribe((items: Array<HistoryModel>) => {
      this.historyList = items;
    });


  }

  showModifierName(id: number, index: number) {
    this.modifierDetailsSubscription = this.crudService.getById(ROUTES_MODEL_CONFIG.users, id).subscribe((item: UserModel) => {
      this.historyList[index].modifier_name = item.name;
    })
  }




  /* *************************Typeahead ************************************** */
  /* Serch Product */
  searchProduct = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.productInput.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.productsList
        : this.productsList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 20))
    );
  }
  /* Used in template */
  formatterProduct = (x: { name: string }) => x.name;

  /* Serch Producer */
  searchProducer = (text2$: Observable<string>) => {
    const debouncedText2$ = text2$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup2$ = this.click2$.pipe(filter(() => !this.producerInput.isPopupOpen()));
    const inputFocus$ = this.focus2$;

    return merge(debouncedText2$, inputFocus$, clicksWithClosedPopup2$).pipe(
      map(term => (term === '' ? this.producersList
        : this.producersList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
  /* Used in template */
  formatterProducer = (x: { name: string }) => x.name;

}
