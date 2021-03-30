import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ContextModel, DepositModel, ProducerModel, ProductModel, SupplierModel, NecessaryModel, OfferModel } from 'src/app/models/app.model';
import { AppStateModel } from 'src/app/models/state.model';
import { CrudService } from '../../services/crud.service';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { AppStateService } from '../../services/app-state.service';
import { UPDATE_CONTEXT, UPDATE_PRODUCTS_PRODUCERS, UPDATE_SUPPLIERS } from '../../models/action.model';
import { CrudFilter } from '../../models/app.model';

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
  @ViewChildren('orderDiscount') discountInputElements: QueryList<ElementRef>;
  @ViewChildren('orderPrice') priceInputElements: QueryList<ElementRef>;

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

  necessaryList: DepositModel[];
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
      this.contextList = this.currentAppstate.context.filter((c: ContextModel) => {
        return c.id == this.currentAppstate.user.context.id || c.central;
      });
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
      }
      /* Set selectedSupplier as default */
      this.selectedSupplier = this.supplierList.filter((s: SupplierModel) => {
        return s.implicit == true;
      })[0];

      if (appState.action == UPDATE_CONTEXT) {
        this.contextList = appState.context;
      }

      /* Set selectedSupplier as default */
      this.selectedContext = this.contextList.filter((c: ContextModel) => {
        return c.implicit == true;
      })[0];

      console.log("ComandaComponent state after subscriptions==", this.appStateService.getAppState());

    });

    /* Get/update necessary data */
    this.refreshNcessaryData();
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

    /* Reset all value from preview supplier */
    this.discountInputElements.forEach((e) => {
      e.nativeElement.value = '';
    })
    this.priceInputElements.forEach((e) => {
      e.nativeElement.value = '';
    })
  }

  filterData() {
    console.log(this.filters);
    if (this.filters.product) {
      this.necessaryList = this.necessaryList.filter((n: DepositModel) => {
        return n.product.id == this.filters.product.id;
      })
    }

    if (this.filters.producer) {
      this.necessaryList = this.necessaryList.filter((n: DepositModel) => {
        return n.product.producer.id == this.filters.producer.id;
      })
    }
  }


  refreshNcessaryData() {
    /* Reset fields */
    this.producer = "";
    this.product = "";
    /* Reset filters */
    this.filters = {};
    /* Get necessary from diferent sources dependin on isCentralizat */
    if (this.isCentralizat) {

      this.necessarySubscription = this.crudService.get(ROUTES_MODEL_CONFIG.depositGetAll).subscribe((items: Array<DepositModel>) => {
        this.necessaryList = items;
      });

    } else {
      let crudFilter: CrudFilter[] = [{ proprety: "context", value: this.selectedContext.id.toString() }];

      this.necessarySubscription = this.crudService.getBy(ROUTES_MODEL_CONFIG.necessariesGetByContext, crudFilter).subscribe((items: Array<DepositModel>) => {
        this.necessaryList = items;
      });
    }

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
