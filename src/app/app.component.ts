import { Component } from '@angular/core';
import { AppStateModel } from '../app/models/state.model';
import { AppStateService } from './services/app-state.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentState: AppStateModel;
  constructor(private appstateService: AppStateService) { }

  ngOnInit() {
    this.currentState = this.appstateService.getAppState();
    this.appstateService.setAppState({ ... this.currentState, isLogged: false });
  }
}
