import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { from } from 'rxjs';
import { AppStateModel } from '../../models/state.model';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private appStateService: AppStateService) { }

  title: string;

  ngOnInit(): void {
    this.title = this.appStateService.getAppState().title;
  }

  menuOnSelect(option: string) {
    console.log(option);
    this.router.navigate([`/${option}`]);
  }

}
