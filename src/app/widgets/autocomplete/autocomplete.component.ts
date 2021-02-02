import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, DoCheck } from '@angular/core';
import { AUTOMPLETE_MAX_ITEMS } from '../../app.config';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() idTemplate;
  @ViewChild('atcData', { static: true }) atcDataElement: ElementRef;
  placeholderName: string;
  /* set the visibility of drop-down */
  isVisible = false;
  /* string displayed in input */
  stringToSearch: string = "";
  /* drop-down mouse over status */
  isMouseOver: boolean = false;
  /* only products to be displayed in drop-down */
  productsToDisplay: string[];
  /* all products from database */
  products: string[] = [];
  /* define store URL string for each autocomplete
  to avoid backend request fore each time we use this autocomplete,
   we define  a string representing an action and get data from appState .
   in appState we load all data we need one time */
  storeUrl: string = ""

  /* this keep index of drop-down iteration by arrow keys */
  crtSelectedIndex = -1;

  constructor() { }

  ngOnInit(): void {
    /* Get first part from idTemplate */
    this.placeholderName = this.idTemplate.split("-")[0];
    for (let i = 1; i < 18000; i++) {
      this.products.push("a" + i);
    }
    this.productsToDisplay = this.products.slice(0, AUTOMPLETE_MAX_ITEMS);;
  }

  /* fired at every change on input
  if input value is empty, then reset stringToSearch and reset productsToDisplay at the initial value
  */
  onSearchChange(evt) {
    if (evt == "") {
      /* reset stringToSearch */
      this.stringToSearch = "";
      /*  reset productsToDisplay at the initial value */
      this.productsToDisplay = this.products.slice(0, AUTOMPLETE_MAX_ITEMS);
    }
  }
  toggleVisible() {
    this.isVisible = !this.isVisible;
  }
  /* is fired when input get fous */
  inputFocuson() {
    /* show drop-down */
    this.isVisible = true;
    this.isMouseOver = false;
  }


  autocompleteSelected(index) {

    this.isVisible = false;
    this.stringToSearch = this.productsToDisplay[index];
    console.log("autocompleteSelected", index, this.productsToDisplay[index]);
  }


  iterateAutocomplete(direction: string) {
    let currentScrollPosition = document.getElementById(this.idTemplate).scrollTop;
    if (direction == 'down') {
      this.crtSelectedIndex < AUTOMPLETE_MAX_ITEMS ? this.crtSelectedIndex++ : this.crtSelectedIndex;
      if (this.crtSelectedIndex > 7) {
        /* controls scroll position if arrow key is presed */
        document.getElementById(this.idTemplate).scrollTop = currentScrollPosition + this.crtSelectedIndex * 4;
      }
    } else {
      this.crtSelectedIndex > 0 ? this.crtSelectedIndex-- : this.crtSelectedIndex;
      if (this.crtSelectedIndex < 13) {
        /* controls scroll position if arrow key is presed */
        document.getElementById(this.idTemplate).scrollTop = currentScrollPosition - this.crtSelectedIndex * 5;
      }
    }


  }

  filterKeyPress(evt) {
    switch (evt.key) {
      case 'ArrowDown': {
        if (!this.isMouseOver) {
          this.iterateAutocomplete('down');
        }

        break;
      }
      case 'ArrowUp': {
        if (!this.isMouseOver) {
          this.iterateAutocomplete('up');
        }

        break;
      }
      case 'Enter': {
        this.stringToSearch = this.productsToDisplay[this.crtSelectedIndex];
        this.isVisible = false;
        break;
      }
      default: {
        this.isVisible = true;
        this.filterDisplayData();
        break;
      }
    }

  }

  filterDisplayData() {
    let temp = this.products.filter((item: string) => {
      return item.startsWith(this.stringToSearch);
    })

    this.productsToDisplay = temp.slice(0, AUTOMPLETE_MAX_ITEMS);
  }

  atcClicked(event) {
    console.log("atcClicked")
    this.filterDisplayData();
  }

  /* is fired when mouse is over drop-down */
  mouseOverAtcData(index) {
    // console.log(index);
    this.isMouseOver = true;
    /* crtSelectedIndex is used to mark data in drop-down
    if mouseOver this contor mast be reset
    */
    this.crtSelectedIndex = -1;
    this.stringToSearch = this.productsToDisplay[index];

  }

  /* Testing only */
  inputFoucuout() {
    this.isVisible = false;
  }

}
