import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from "@angular/common/http";
import { environment } from '.././../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private httpClient: HttpClient) { }


  get(resURL) {
    return this.httpClient.get(environment.apiUrl + `/${resURL}`);
  }

  getById(resURL, id){
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
