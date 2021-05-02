import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import {CrudFilter} from '../models/app.model';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private httpClient: HttpClient) { }


  get(resURL) {
    return this.httpClient.get(environment.apiUrl + `/${resURL}`);
  }

  getBy(resURL, filters: CrudFilter[]) {

    let params: HttpParams =  new HttpParams();
    if (filters.length > 0) {
      filters.forEach((f) => {
        params = params.set(f.proprety, f.value);
      })
    }

    return this.httpClient.get(environment.apiUrl + `/${resURL}`, { params });
  }

  getById(resURL, id) {
    return this.httpClient.get(environment.apiUrl + `/${resURL}/${id}`);
  }


  update(resURL, obj) {
    return this.httpClient.put(environment.apiUrl + `/${resURL}`, obj);
  }

  delete(resURL, id) {
    return this.httpClient.delete(environment.apiUrl + `/${resURL}/${id}`);
  }

  post(resURL, obj) {
    return this.httpClient.post(environment.apiUrl + `/${resURL}`, obj);
  }
}
