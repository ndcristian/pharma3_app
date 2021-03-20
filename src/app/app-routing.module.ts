import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NecesarComponent } from './main/necesar/necesar.component';
import { ComandaComponent } from './main/comanda/comanda.component';
import { IstoricComponent } from './main/istoric/istoric.component';
import { MainviewComponent } from '../app/main/mainview/mainview.component';
import { AdminComponent } from '../app/admin/admin/admin.component';
import { LoginComponent } from '../app/credentials/login/login.component';
import { MessageComponent } from '../app/credentials/message/message.component';
import { GuardService } from './credentials/auth/guard.service';


const routes: Routes = [
  {
    path: '',
    component: MainviewComponent,
  },
  {
    path: 'necesar',
    component: NecesarComponent,
    canActivate: [GuardService]
  },
  {
    path: 'comanda',
    component: ComandaComponent,
    canActivate: [GuardService]
  },
  {
    path: 'istoric',
    component: IstoricComponent,
    canActivate: [GuardService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [GuardService]
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
