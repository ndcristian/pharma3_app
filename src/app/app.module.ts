import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Auth */
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './credentials/auth/interceptor.service';

/* App */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { NecesarComponent } from './main/necesar/necesar.component';
import { MainviewComponent } from './main/mainview/mainview.component';
import { AutocompleteComponent } from './widgets/autocomplete/autocomplete.component';
import { ComandaComponent } from './main/comanda/comanda.component';
import { IstoricComponent } from './main/istoric/istoric.component';

import { TypeaheadComponent } from './widgets/typeahead/typeahead.component';
import { LoginComponent } from './credentials/login/login.component';
import { AdminComponent } from './admin/admin/admin.component';
import { UsersComponent } from './admin/users/users.component';
import { PosComponent } from './admin/pos/pos.component';
import { MessageComponent } from './credentials/message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NecesarComponent,
    MainviewComponent,
    AutocompleteComponent,
    ComandaComponent,
    IstoricComponent,
    TypeaheadComponent,
    LoginComponent,
    AdminComponent,
    UsersComponent,
    PosComponent,
    MessageComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
