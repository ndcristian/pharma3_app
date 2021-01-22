import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AUTOMPLETE_MAX_ITEMS } from '../../app.config';

@Component({
  selector: 'app-automplete',
  templateUrl: './automplete.component.html',
  styleUrls: ['./automplete.component.scss']
})
export class AutompleteComponent implements OnInit {

  @Input() idTemplate;
  @ViewChild('atcData', { static: true }) atcDataElement: ElementRef;
  placeholderName: string;
  isVisible = false;
  stringToSearch: string = "";
  isMouseOver: boolean = false;
  productsToDisplay: string[];
  products: string[] = [];

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

  filterAutocomplete() {
    console.log("focus on");
    this.isVisible = true;
    this.isMouseOver = false;
  }

  hideAutocomplete() {
    console.log("hideAutocomplete");
    // this.isVisible = false;
  }

  autocompleteSelected(index) {
    console.log("autocompleteSelected", index);

  }

  focusLost1() {
    console.log("lostFocus----1");
  }

  focusLost2() {
    console.log("lostFocus----2");
  }

  iterateAutocomplete(direction: string) {
    console.log("scroll position", document.getElementById(this.idTemplate).scrollTop);
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
    console.log("leters", evt);
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
        console.log("enter press")
        break;
      }
      default: {
        this.filterDisplayData(evt.key);
        break;
      }
    }

  }

  filterDisplayData(letter: string) {
    console.log(this.stringToSearch);
    let temp = this.products.filter((item: string) => {
      return item.startsWith(this.stringToSearch);
    })

    this.productsToDisplay = temp.slice(0, AUTOMPLETE_MAX_ITEMS);
  }

  atcClicked(event) {
    console.log("atcClicked", event);
    this.filterDisplayData('cancel')
  }
  mouseOverAtcData(index) {
    console.log(index);

    this.isMouseOver = true;
  }

  change2() {
    console.log("change");
  }

}
