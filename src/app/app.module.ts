import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { NecesarComponent } from './main/necesar/necesar.component';
import { MainviewComponent } from './main/mainview/mainview.component';
import { AutompleteComponent } from './widgets/automplete/automplete.component';
import { ComandaComponent } from './main/comanda/comanda.component';
import { IstoricComponent } from './main/istoric/istoric.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NecesarComponent,
    MainviewComponent,
    AutompleteComponent,
    ComandaComponent,
    IstoricComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
