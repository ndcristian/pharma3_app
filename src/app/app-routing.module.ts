import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NecesarComponent } from './main/necesar/necesar.component';
import { ComandaComponent } from './main/comanda/comanda.component';
import { IstoricComponent } from './main/istoric/istoric.component';


const routes: Routes = [
  {
    path: 'necesar',
    component: NecesarComponent,
  },
  {
    path: 'comanda',
    component: ComandaComponent,
  },
  {
    path: 'istoric',
    component: IstoricComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
