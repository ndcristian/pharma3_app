import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../services/crud.service';
import { ProducerModel, ProductModel } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import {AppStateService} from '../../services/app-state.service';


@Component({
  selector: 'app-necesar',
  templateUrl: './necesar.component.html',
  styleUrls: ['./necesar.component.scss']
})
export class NecesarComponent implements OnInit , OnDestroy{

  public product: any;
  public producer: any;

  productSubscription: Subscription;
  producerSubscription: Subscription;

  states2: { name: string, id: number }[] = [
    { id: 1, name: 'Alabama' },
    { id: 2, name: 'Alaska' },
    { id: 3, name: 'American Samoa asdf asdf asdf asdf asdf' },
    { id: 4, name: 'Arizona' },
    { id: 7, name: 'Arkansas' },
    { id: 6, name: 'California' },
    { id: 8, name: 'Colorado' },
    { id: 9, name: 'Washington' },
    { id: 11, name: 'Oregon' },
    { id: 12, name: 'Hawaii' }

  ];

  states: { name: string, id: number }[] = [
    { id: 1, name: 'Alabama' },
    { id: 2, name: 'Alaska' },
    { id: 3, name: 'American Samoa asdf asdf asdf asdf asdf' },
    { id: 4, name: 'Arizona' },
    { id: 7, name: 'Arkansas' },
    { id: 6, name: 'California' },
    { id: 8, name: 'Colorado' },
    { id: 9, name: 'Washington' },
    { id: 11, name: 'Oregon' },
    { id: 12, name: 'Hawaii' }

  ];

  constructor(private crudService: CrudService, private appStateService:AppStateService) { }

  ngOnInit(): void {

    console.log("NecesarComponent onInit");

    console.log(this.appStateService.getAppState());

    /* Get Products */
    this.productSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.products).subscribe((items: Array<ProductModel>) => {
      // this.productsList = items;
    })
    /* Get Producers */
    this.producerSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.producers).subscribe((items: Array<ProducerModel>) => {
      // this.producersList = items;
    })

  }

  ngOnDestroy(): void {
    if (this.producerSubscription) {
      this.producerSubscription.unsubscribe();
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }


  @ViewChild('productInput', { static: true }) productInput: NgbTypeahead;
  @ViewChild('producerInput', { static: true }) producerInput: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  focus2$ = new Subject<string>();
  click2$ = new Subject<string>();


  searchProduct = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.productInput.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.states
        : this.states.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );


  }
  formatterProduct = (x: { name: string }) => x.name;


  searchProducer = (text2$: Observable<string>) => {
    const debouncedText2$ = text2$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup2$ = this.click2$.pipe(filter(() => !this.producerInput.isPopupOpen()));
    const inputFocus$ = this.focus2$;

    return merge(debouncedText2$, inputFocus$, clicksWithClosedPopup2$).pipe(
      map(term => (term === '' ? this.states2
        : this.states2.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  formatterProducer = (x: { name: string }) => x.name;

  addProduct() {
    console.log(this.producer, this.product);
  }


}
