import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    LoginComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
