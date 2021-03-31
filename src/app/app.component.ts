import { Component } from '@angular/core';
import { AppStateModel } from '../app/models/state.model';
import { AppStateService } from './services/app-state.service';
import * as moment from 'moment';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentState: AppStateModel;
  constructor(private appstateService: AppStateService) { }

  ngOnInit() {
    console.log("------AppComponent OnInit");
    this.currentState = this.appstateService.getAppState();
    // let curentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    let curentDate:Date = moment().toDate();
    let before30Date = moment().subtract(30,'days').toDate();
    console.log(curentDate, before30Date);
    this.appstateService.setAppState({ ... this.currentState, isLogged: false, currentDate:curentDate, before30Date:before30Date });
  }
}

