import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss']
})
export class ComandaComponent implements OnInit {


  activeTab: string = "pl";

  constructor() { }

  ngOnInit(): void {
  }

  onTabSelected(selectedTab: string) {
    console.log(selectedTab)
    this.activeTab = selectedTab;
  }

}
