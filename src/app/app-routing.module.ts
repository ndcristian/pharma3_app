import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NecesarComponent } from './main/necesar/necesar.component';
import { ComandaComponent } from './main/comanda/comanda.component';
import { IstoricComponent } from './main/istoric/istoric.component';
import {AdminComponent} from '../app/admin/admin/admin.component';
import {LoginComponent} from '../app/credentials/login/login.component';
import {MessageComponent} from '../app/credentials/message/message.component';


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
  },
  {
    path: 'admin',
    component: AdminComponent
   },
   {
     path: 'login',
     component: LoginComponent
    },
    {
      path: 'message',
      component: MessageComponent
     }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' , useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
