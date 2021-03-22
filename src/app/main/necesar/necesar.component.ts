import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

    console.log("NecesarComponent onInit");

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
    this.necessaryToSave.product = product;
    this.filters.product = product;
    this.producer = product.producer;
    console.log("necessaryToSave", this.necessaryToSave);
  }

  onSelectProducer(producer: ProducerModel) {
    this.filters.producer = producer;
    delete this.filters.product;
    this.product = "";
    console.log(producer);
  }

  onSelectRow(necessary: NecessaryModel) {
    console.log("onSelectRow", necessary);
    this.selectedNecessary = { ...necessary };
  }

  onChangeQty(value: number) {
    this.selectedNecessary.necessary = value;
    console.log("onChangeQty", this.selectedNecessary);
  }

  onChangeObs(value: string) {
    this.selectedNecessary.obs = value;
    console.log("omChangeObs", this.selectedNecessary);
  }


  addProduct(qty: number, obs: string) {
    console.log("addProduct", qty, obs);
    this.necessaryToSave.product = this.product;
    this.necessaryToSave.necessary = qty;
    this.necessaryToSave.obs = obs;

    /* Send request only if product and qty exist */
    if (this.necessaryToSave.product && this.necessaryToSave.necessary) {
      this.crudService.post(ROUTES_MODEL_CONFIG.necessaries, this.necessaryToSave).subscribe((id: number) => {
        /* Add new product at top first position in the array */
        this.necessaryList = [this.necessaryToSave, ...this.necessaryList]
      })
    } else {
      alert("Incomplet data");
    }

  }

  /* Update row in necessary */
  updateNecesary(necessary: NecessaryModel) {

    console.log("updateNecesary", this.selectedNecessary);
    /* Check if modified row is the same with save button clicked row 
    Check if data was modified
    */
    if (
      this.selectedNecessary.id == necessary.id &&
      (this.selectedNecessary.necessary != necessary.necessary ||
        this.selectedNecessary.obs != necessary.obs)
    ) {
      this.crudService.update(ROUTES_MODEL_CONFIG.necessaries, this.selectedNecessary).subscribe((id: number) => {
        console.log("updatedId", id);
      });
    } else {
      if (this.selectedNecessary.id != necessary.id) {
        alert("Acest rand nu contine date modificate");
        this.refreshNcessaryData();
      }
    }
  }

  deleteNecessary(id: number, index: number) {
    console.log(id, index);
    this.crudService.delete(ROUTES_MODEL_CONFIG.necessaries, id).subscribe((id: number) => {
      if (id && id > 0) {
        this.necessaryList.splice(index, 1);
       }
    })
  }

  refreshNcessaryData() {
    /* Reset fields */
    this.producer = "";
    this.product = "";
    /* Reset filters */
    this.filters = {};
    /* Get necessary */
    let crudFilter: CrudFilter[] = [{ proprety: "context", value: "0" }]
    this.necessarySubscription = this.crudService.getBy(ROUTES_MODEL_CONFIG.necessariesGetByContext, crudFilter).subscribe((items: Array<NecessaryModel>) => {

      this.necessaryList = items;
    })
  }

  filterData() {

    console.log(this.filters);
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
