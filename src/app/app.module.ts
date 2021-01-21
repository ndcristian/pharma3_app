import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { NecesarComponent } from './main/necesar/necesar.component';
import { MainviewComponent } from './main/mainview/mainview.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NecesarComponent,
    MainviewComponent
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
