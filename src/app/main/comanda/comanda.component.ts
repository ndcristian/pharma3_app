import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../services/crud.service';
import { ContextModel, DepositModel, ProducerModel, ProductModel, SupplierModel, NecessaryModel, OfferModel, HistoryModel } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { AppStateService } from '../../services/app-state.service';
import { AppStateModel } from 'src/app/models/state.model';
import { UPDATE_CONTEXT, UPDATE_PRODUCTS_PRODUCERS, UPDATE_SUPPLIERS } from '../../models/action.model';
import { CrudFilter } from '../../models/app.model';
import { isBreakOrContinueStatement } from 'typescript';


@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss']
})
export class ComandaComponent implements OnInit, OnDestroy, AfterViewInit {

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

  activeTab: string = "pl";

  productsList: ProducerModel[];
  producersList: ProducerModel[];

  productSubscription: Subscription;
  posSubscripton: Subscription;
  supplierSubscription: Subscription;
  necessarySubscription: Subscription;
  historyDetailsSubscription: Subscription;
  necessaryDetailsSubscription: Subscription;
  offerDetailsSubscription: Subscription;

  necessaryList: DepositModel[];
  supplierList: SupplierModel[];
  contextList: ContextModel[];
  necessaryDetailsList: NecessaryModel[];
  offerDetailsList: OfferModel[];
  historyDetailsList: HistoryModel[];

  currentAppstate: AppStateModel;
  filters: { product?: ProducerModel, producer?: ProducerModel } = {};

  isCentralizat: boolean = false;
  selectedContext: ContextModel;
  selectedSupplier: SupplierModel;
  selectedNecessaryRow: DepositModel;

  offerToSave: OfferModel = { price: 0, discount: 0, final_price: 0 };
  necessaryToSave: DepositModel = {};

  /* if supplier is changed, reset all discount and price noticed before */
  supplierChanged: boolean = false;

  constructor(private crudService: CrudService, private appStateService: AppStateService) { }

  // value="{{(selectedNecessaryRow && row.id==selectedNecessaryRow.id) ? offerToSave.final_price : ''}}"

  ngOnInit(): void {

    console.log("ComandaComponent onInit");

    this.currentAppstate = this.appStateService.getAppState();

    /* If page refresh from CoandaComponent , appState will be undefined 
    To avoid this, make a subscription to update the appState
    */
    if (this.currentAppstate) {
      this.productsList = this.currentAppstate.products;
      this.producersList = this.currentAppstate.producers;
      this.contextList = this.currentAppstate.context;
      this.supplierList = this.currentAppstate.supplier;

      /* Set selectedSupplier as default */
      this.selectedSupplier = this.supplierList.filter((s: SupplierModel) => {
        return s.implicit == true;
      })[0];

      /* Set selectedSupplier as default */
      this.selectedContext = this.contextList.filter((c: ContextModel) => {
        return c.implicit == true;
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

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    if (this.supplierSubscription) {
      this.supplierSubscription.unsubscribe();
    }
    if (this.posSubscripton) {
      this.posSubscripton.unsubscribe();
    }
    if (this.necessarySubscription) {
      this.necessarySubscription.unsubscribe();
    }
    if (this.necessaryDetailsSubscription) {
      this.necessaryDetailsSubscription.unsubscribe();
    }
    if (this.historyDetailsSubscription) {
      this.historyDetailsSubscription.unsubscribe();
    }
    if (this.offerDetailsSubscription) {
      this.offerDetailsSubscription.unsubscribe();
    }


  }

  ngAfterViewInit() {

  }

  onSelectRow(item: DepositModel) {
    // console.log("onSelectRow", item);
    this.supplierChanged = false;
    this.selectedNecessaryRow = item;
    this.offerToSave.product = item.product.id;
    /* With every click on row this variable is reset an we lose all the data entered */
    if (!this.necessaryToSave.id || this.necessaryToSave.id != this.selectedNecessaryRow.id) {
      this.necessaryToSave = item;
      console.log("onSelectRow:", this.necessaryToSave);
    }

  }

  onSelectProduct(product: ProductModel) {
    this.filters.product = product;
    this.producer = product.producer;
    console.log("necessaryToSave on select", this.necessaryToSave);
  }

  onSelectProductKeyPress() {
    this.filters.product = this.product;
    this.producer = this.product.producer;
    console.log("necessaryToSave on select", this.necessaryToSave);
  }

  onSelectProducer(producer: ProducerModel) {
    this.filters.producer = producer;
    delete this.filters.product;
    this.product = "";
    console.log(producer);
  }

  onSelectProducerKeyPress() {
    this.filters.producer = this.producer;
    this.product = "";
    console.log("necessaryToSave on select", this.necessaryToSave);
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


  onChangePret(value: number) {

    if (value && value > 0) {
      this.offerToSave.price = +value;
      this.necessaryToSave.price = +value;

      if (this.offerToSave.discount && this.offerToSave.discount > 0) {
        this.offerToSave.final_price = parseFloat((this.offerToSave.price * (1 - this.offerToSave.discount / 100)).toFixed(2));
        this.necessaryToSave.final_price = parseFloat((this.offerToSave.price * (1 - this.offerToSave.discount / 100)).toFixed(2));
      } else {
        this.offerToSave.final_price = +value;
        this.necessaryToSave.final_price = +value;
      }
    }
  }

  onChangeDiscount(value: number) {

    if (value && value > 0) {
      this.offerToSave.discount = +value;
      this.necessaryToSave.discount = +value;

      if (this.offerToSave.price && this.offerToSave.price > 0) {
        this.offerToSave.final_price = parseFloat((this.offerToSave.price * (1 - this.offerToSave.discount / 100)).toFixed(2));
        this.necessaryToSave.final_price = parseFloat((this.offerToSave.price * (1 - this.offerToSave.discount / 100)).toFixed(2));
      } else {
        this.offerToSave.final_price = +value;
        this.necessaryToSave.final_price = +value;
      }
    }
  }


  onChangeOrderQty(value: number) {
    this.necessaryToSave.newQtyOrdered = +value;
    console.log("necessaryToSave", this.necessaryToSave);
  }

  onChangeObs(value: string) {
    this.offerToSave.offer_details = value;
    this.necessaryToSave.obs = value;
    console.log("necessaryToSave", this.necessaryToSave);
  }

  saveOffer() {
    this.offerToSave.supplier = this.selectedSupplier;
    if ((this.offerToSave.price && this.offerToSave.price > 0) || (this.offerToSave.discount && this.offerToSave.discount > 0)) {
      console.log("offerToSave", this.offerToSave);
      this.crudService.post(ROUTES_MODEL_CONFIG.offers, this.offerToSave).subscribe((id: number) => {
      })
    }
  }

  saveOrder(index: number) {
    this.necessaryToSave.supplier = this.selectedSupplier;
    console.log("necessaryToSave", this.necessaryToSave, this.selectedContext);
    let routeToSendRequest = this.selectedContext.central ? ROUTES_MODEL_CONFIG.deposit : ROUTES_MODEL_CONFIG.necessariesPutOrder;

    this.crudService.update(routeToSendRequest, this.necessaryToSave).subscribe((id: number) => {
      console.log("idUpdated", id);

      if (id && id > 0) {
        /* Update odrered qty in tabel */
        this.necessaryList[index].ordered += this.necessaryToSave.newQtyOrdered;
        /* Update rest in tabel */
        this.necessaryList[index].rest -= this.necessaryToSave.newQtyOrdered;

        if (this.selectedNecessaryRow.rest <= 0) {

          this.necessaryList.splice(index, 1);
        }
      }
    });
  }

  resetButton() {
    this.product = "";
    this.producer = "";
    console.log(this.currentAppstate);
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

  showDetails(row: HistoryModel) {
    console.log("showDetails", row);

    switch (this.activeTab) {
      case 'pl':
        /* in DB necessary we look for id_deposit . in centralizat mode this id is row.id */
        let idForDetailsPl = this.isCentralizat ? row.id : row.deposit;
        this.refreshNecessaryDetails(idForDetailsPl);
        break;
      case 'comercial':
        let idForDetailsComercial = row.product.id;
        this.refreshOfferDetails(idForDetailsComercial);
        break;
      case 'history':
        let idForDetailsHistory = row.product.id;
        this.refreshHistoryDetails(idForDetailsHistory);
        break;
    }

  }

  onSelectTab(selectedTab: string) {
    console.log(selectedTab);
    this.activeTab = selectedTab;
    switch (this.activeTab) {
      case 'pl':
        if (this.selectedNecessaryRow) {
          let idForDetailsPl = this.isCentralizat ? this.selectedNecessaryRow.id : this.selectedNecessaryRow.deposit;
          this.refreshNecessaryDetails(idForDetailsPl);
        }
        break;
      case 'comercial':
        if (this.selectedNecessaryRow) {
          this.refreshOfferDetails(this.selectedNecessaryRow.product.id);
        }
        break;
      case 'history':
        if (this.selectedNecessaryRow) {
          this.refreshHistoryDetails(this.selectedNecessaryRow.product.id);
        }
        break;
    }

  }

  /* Refesh  necessary details when details button is pressed */
  refreshNecessaryDetails(id: number) {
    let crudFilter: CrudFilter[] = [{ proprety: "deposit", value: id.toString() }];
    this.necessaryDetailsSubscription = this.crudService.getBy(ROUTES_MODEL_CONFIG.necessariesGetByProduct, crudFilter).subscribe((items: Array<NecessaryModel>) => {
      /* Add name to context , replace id  with name */
      items.forEach((i) => {
        let v1: ContextModel[] = this.contextList.filter((c: ContextModel) => { return c.id == i.context });
        i.context_name = v1.length > 0 ? v1[0].name : "";
      });
      this.necessaryDetailsList = items;
    })
  }

  /* Refesh offers details when details button is pressed */
  refreshOfferDetails(id: number) {
    let crudFilter: CrudFilter[] = [{ proprety: "product", value: id.toString() }];
    this.offerDetailsSubscription = this.crudService.getBy(ROUTES_MODEL_CONFIG.offersGetByProduct, crudFilter).subscribe((items: Array<OfferModel>) => {
      console.log("Oferte:::", items)

      this.offerDetailsList = items;
    })

  }
  /* Refesh history details when details button is pressed */
  refreshHistoryDetails(id: number) {
    let crudFilter: CrudFilter[] = [{ proprety: "product", value: id.toString() }];
    this.offerDetailsSubscription = this.crudService.getBy(ROUTES_MODEL_CONFIG.historiesGetByProduct, crudFilter).subscribe((items: Array<HistoryModel>) => {
      console.log("History:::", items)

      this.historyDetailsList = items;
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
