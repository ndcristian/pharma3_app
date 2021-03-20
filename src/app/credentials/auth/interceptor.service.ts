import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { COOKIE_NAME } from '../../models/config.models';

@Injectable({
  providedIn: 'root'
})
/* Intercept any request and add in header - Authorization : token from cookie */
/* Must be put in app.modules in providers  */
export class InterceptorService {

  constructor(public cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /* Header must be  cloned . request is immutable */
    if (this.cookieService.check(COOKIE_NAME)) {
      let cookieToObject = JSON.parse(this.cookieService.get(COOKIE_NAME));
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${cookieToObject.token}`
        }
      });
    }

    return next.handle(request);
  }


}
