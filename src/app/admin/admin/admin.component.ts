import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute, OutletContext} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  activeView = 'users';

  constructor(private router: Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
  }

  menuOnSelect(option: string) {
    this.activeView = option;
    
  }

}
