import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CrudService } from '../../services/crud.service';
import { ROUTES_MODEL_CONFIG } from '../../models/config.models';
import { ContextModel, CredentialModel, RoleModel, UserModel } from 'src/app/models/app.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  credentialSubscription: Subscription;
  roleSubscription: Subscription;
  contextSubscription: Subscription;

  usersList: UserModel[];
  rolesList: RoleModel[];
  contextesList: ContextModel[];

  defaultRole: RoleModel[];
  defaultContext: ContextModel[];

  selectedUserCredentials: CredentialModel;

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {

    /* Get users */
    this.credentialSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.credentials).subscribe((items: Array<CredentialModel>) => {
      this.usersList = items;
      console.log("UsersComponent users", items);
    })

    /* Get roles */
    this.roleSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.roles).subscribe((items: Array<RoleModel>) => {
      this.rolesList = items;
      console.log("UsersComponent roles", items);
      /* Define default role */
      this.defaultRole = this.rolesList.filter((r) => {
        return r.implicit == true;
      })
      console.log(":default role", this.defaultRole)

    })

    /* Get contextes */
    this.contextSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.contextes).subscribe((items: Array<ContextModel>) => {
      this.contextesList = items;
      console.log("UsersComponent context", items);
      /* Define default context */
      this.defaultContext = this.contextesList.filter((c) => {
        return c.implicit == true;
      })
      console.log(":default context", this.defaultContext)
    })

  }

  ngOnDestroy(): void {
    if (this.credentialSubscription) {
      this.credentialSubscription.unsubscribe();
    }
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
    if (this.contextSubscription) {
      this.contextSubscription.unsubscribe();
    }
  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      let userToInsert = {
        username: form.value.username,
        email: form.value.email,
        name: form.value.name,
        password: form.value.password,
        role: this.defaultRole[0],
        context: this.defaultContext[0]
      }
      console.log(userToInsert)
      this.crudService.post(ROUTES_MODEL_CONFIG.register, userToInsert).subscribe((id: number) => {
     console.log("inserted id:",id )
        if (id && id > 0) {
          this.usersList.push(userToInsert);
          /* assign id to user added */
          this.usersList[this.usersList.length - 1].id = id;
        }

      })

    } else {
      alert("Date incomplete!");
    }

  }

  /* Row select - set selected user */
  onSelectRow(credentials: CredentialModel) {
    console.log("onSelectRow::", credentials);
    this.selectedUserCredentials = credentials;

  }

  /* Change role */
  onChangeRole(roleId: number, credentials: CredentialModel, rowIndex: number) {

    let selectedRole: RoleModel[] = this.rolesList.filter((r) => {
      return r.id == roleId;
    })

    credentials.role = selectedRole[0];
    this.selectedUserCredentials = credentials;

  }

  /* Change context */
  onChangeContext(contextId: number, credentials: CredentialModel, rowIndex: number) {

    let selectedContext: ContextModel[] = this.contextesList.filter((c) => {
      return c.id == +contextId;
    })

    credentials.context = selectedContext[0];
    this.selectedUserCredentials = credentials;

  }

  onChangePassword(value: string) {
    console.log("onChangePassword:::", value);
    this.selectedUserCredentials.password = value;
  }



  update() {
    console.log(this.selectedUserCredentials)
    this.crudService.update(ROUTES_MODEL_CONFIG.credentials, this.selectedUserCredentials).subscribe((id: number) => {

    })
  }

  delete(credentials: CredentialModel, index) {
    this.crudService.delete(ROUTES_MODEL_CONFIG.credentials, credentials.id).subscribe((id: number) => {
      this.usersList.splice(index, 1);
    })

    console.log("deleted id:", credentials, index);
  }

}
