import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppStateModel } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private appState: AppStateModel

  appStateOnChange = new Subject<AppStateModel>();

  constructor() { }

  setAppState(newState: AppStateModel) {
    this.appState = newState;
  }

  getAppState():AppStateModel {
    return this.appState;
  }
}
