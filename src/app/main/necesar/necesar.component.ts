import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../services/crud.service';
import { NecessaryModel, ProducerModel, ProductModel } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { AppStateService } from '../../services/app-state.service';
import { AppStateModel } from 'src/app/models/state.model';
import { CrudFilter } from '../../models/app.model';
import { UPDATE_PRODUCTS_PRODUCERS } from '../../models/action.model';


@Component({
  selector: 'app-necesar',
  templateUrl: './necesar.component.html',
  styleUrls: ['./necesar.component.scss']
})
export class NecesarComponent implements OnInit, OnDestroy {

  public product: any;
  public producer: any;

  @ViewChild('productInput', { static: true }) productInput: NgbTypeahead;
  @ViewChild('producerInput', { static: true }) producerInput: NgbTypeahead;
  @ViewChild('qty', { static: true }) qtyInput: ElementRef;
  @ViewChild('obs', { static: true }) obsInput: ElementRef;
  // @ViewChildren('orderDiscount') qtyInput: QueryList<ElementRef>;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  focus2$ = new Subject<string>();
  click2$ = new Subject<string>();

  activeSubscription: Subscription;
  necessarySubscription: Subscription;

  productsList: ProducerModel[];
  producersList: ProducerModel[];

  currentAppstate: AppStateModel;
  necessaryList: NecessaryModel[];

  /* That means filter will be made by user context */
  defaultNecessaryId = 0;

  necessaryToSave: NecessaryModel = {};
  selectedNecessary: NecessaryModel = {};



  filters: { product?: ProducerModel, producer?: ProducerModel } = {};

  constructor(private crudService: CrudService, private appStateService: AppStateService) { }

  ngOnInit(): void {

    this.currentAppstate = this.appStateService.getAppState();

    /* If page refresh from CoandaComponent , appState will be undefined 
    To avoid this, make a subscription to update the appState
    */
    if (this.currentAppstate) {
      this.productsList = this.currentAppstate.products;
      this.producersList = this.currentAppstate.producers;
    }

    /* Fired after login */
    this.activeSubscription = this.appStateService.appStateOnChange.subscribe((appState: AppStateModel) => {
      // debugger;
      if (appState.action == UPDATE_PRODUCTS_PRODUCERS) {
        this.currentAppstate = appState;
        this.productsList = this.currentAppstate.products;
        this.producersList = this.currentAppstate.producers;
      }
    })

    /* Get/update necessary data */
    this.refreshNcessaryData();

  }


  ngOnDestroy(): void {
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
    if (this.necessarySubscription) {
      this.necessarySubscription.unsubscribe();
    }
  }

  onSelectProduct(product: ProductModel) {
    this.filters.product = product;
    this.producer = product.producer;
  }

  onSelectProductKeyPress() {
    this.filters.product = this.product;
    this.producer = this.product.producer;
  }

  onSelectProducer(producer: ProducerModel) {
    this.filters.producer = producer;
    delete this.filters.product;
    this.product = "";
  }

  onSelectProducerKeyPress() {
    this.filters.producer = this.producer;
    this.product = "";
  }

  filterData() {

    if (this.filters.product) {
      this.necessaryList = this.necessaryList.filter((n) => {
        return n.product.id == this.filters.product.id;
      })
    }

    if (this.filters.producer) {
      this.necessaryList = this.necessaryList.filter((n) => {
        return n.product.producer.id == this.filters.producer.id;
      })
    }
  }



  onSelectRow(necessary: NecessaryModel) {
    this.selectedNecessary = { ...necessary };
  }

  onChangeQty(value: number) {
    this.selectedNecessary.necessary = value;
  }

  onChangeObs(value: string) {
    this.selectedNecessary.obs = value;
  }


  addProduct(qty: number, obs: string) {
    this.necessaryToSave.product = this.product;
    this.necessaryToSave.necessary = qty;
    this.necessaryToSave.obs = obs;

    /* Send request only if product and qty exist */
    if (this.necessaryToSave.product && this.necessaryToSave.necessary) {
      this.crudService.post(ROUTES_MODEL_CONFIG.necessaries, this.necessaryToSave).subscribe((id: number) => {
        /* Add new product at top first position in the array */

        if (id < 0) {
          alert("Produsul exista deja in necesar")
        } else {
          this.necessaryToSave.id = id;
          this.necessaryToSave.ordered = 0;
          this.necessaryList.splice(0, 0, this.necessaryToSave);
          this.resetinputFields();
          // console.log(this.qtyInput.nativeElement.value);
        }

      })
    } else {
      alert("Incomplet data");
    }

  }

  resetinputFields() {
    this.necessaryToSave = {};
    this.qtyInput.nativeElement.value = '';
    this.obsInput.nativeElement.value = '';
    this.producer = '';
    this.product = '';
    this.filters = {};
  }

  /* Update row in necessary */
  updateNecesary(necessary: NecessaryModel) {

    /* Check if modified row is the same with save button clicked row 
    Check if data was modified
    */
    if (
      this.selectedNecessary.id == necessary.id &&
      (this.selectedNecessary.necessary != necessary.necessary ||
        this.selectedNecessary.obs != necessary.obs)
    ) {
      this.crudService.update(ROUTES_MODEL_CONFIG.necessaries, this.selectedNecessary).subscribe((id: number) => {
      });
    } else {
      if (this.selectedNecessary.id != necessary.id) {
        alert("Acest rand nu contine date modificate");
        this.refreshNcessaryData();
      }
    }
  }

  deleteNecessary(id: number, index: number) {
    this.crudService.delete(ROUTES_MODEL_CONFIG.necessaries, id).subscribe((id: number) => {
      if (id && id > 0) {
        this.necessaryList.splice(index, 1);
      }
    })
  }

  refreshNcessaryData() {
    /* Reset fields */
    // this.producer = "";
    // this.product = "";
    /* Reset filters */
    // this.filters = {};
    this.resetinputFields();
    /* Get necessary */
    let crudFilter: CrudFilter[] = [{ proprety: "context", value: "0" }]
    this.necessarySubscription = this.crudService.getBy(ROUTES_MODEL_CONFIG.necessariesGetByContext, crudFilter).subscribe((items: Array<NecessaryModel>) => {

      this.necessaryList = items;
    },
      (error) => {
        if (error.status == 401) {
          alert("Sesiunea a expirat.");
        }
      })
  }


  /* *************************Typeahead ************************************** */
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




}
