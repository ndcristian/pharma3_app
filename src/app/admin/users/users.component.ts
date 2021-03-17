import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CrudService } from '../../services/crud.service';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { CredentialModel, UserModel } from 'src/app/models/app.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  credentialSubscription: Subscription;

  usersList: UserModel[];

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {

    this.credentialSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.credentials).subscribe((items: Array<CredentialModel>) => {
      this.usersList = items;
      console.log("UsersComponent", items);
    })

  }

  ngOnDestroy(): void {
    if (this.credentialSubscription) {
      this.credentialSubscription.unsubscribe();
    }
  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      this.crudService.post(ROUTES_MODEL_CONFIG.register, form.value).subscribe((id: Number) => {
        console.log("inserted id:", id);
        this.usersList.push(form.value);
      })
    } else {
      alert("Date incomplete!");
    }

  }

  update(credentials: CredentialModel, index) {
    this.crudService.update(ROUTES_MODEL_CONFIG.credentials, credentials).subscribe((id: number) => {

    })
  }

  delete(credentials: CredentialModel, index) {
    this.crudService.delete(ROUTES_MODEL_CONFIG.credentials, credentials.id).subscribe((id: number) => {
      this.usersList.splice(index, 1);
    })

    console.log("deleted id:",credentials, index);
  }

}
