import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss']
})
export class MainviewComponent implements OnInit {

  @ViewChild('atcData', { static: true }) atcDataElement: ElementRef;
  isVisible = false;
  stringToSearch:string="";

  productsToDisplay : string[];
  products: string[] = [];

  crtSelectedIndex = 0;

  constructor() { }

  ngOnInit(): void {
    for (let i = 1; i < 18000; i++) {
      this.products.push("a" + i);
    }
    this.productsToDisplay=this.products.slice(0, 20);;
  }

  filterAutocomplete() {
    console.log("focus on");
    this.isVisible = true;
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
    console.log("key up-down", direction);
    if (direction == 'up') {
      this.crtSelectedIndex++;
    } else {
      this.crtSelectedIndex--;
    }

    document.getElementById('atcData').scrollTop = this.crtSelectedIndex + this.crtSelectedIndex * 23;
  }

  filterKeyPress(evt) {
    console.log("leters", evt);
    switch (evt.key) {
      case 'ArrowDown': {
        this.iterateAutocomplete('up');
        break;
      }
      case 'ArrowUp': {
        this.iterateAutocomplete('down');
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

    this.productsToDisplay = temp.slice(0, 20);
  }

  atcClicked(event){
    console.log("atcClicked", event );
    this.filterDisplayData('cancel')
  }

  change2(){
    console.log("change" );
  }

} 
