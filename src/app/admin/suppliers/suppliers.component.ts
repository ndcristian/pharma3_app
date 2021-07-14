import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContextModel, SupplierModel } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from 'src/app/models/config.models';
import { CrudService } from '../../services/crud.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  supplierList: ContextModel[];

  supplierSubscription: Subscription;

  selectedRow:ContextModel;

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.supplierSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.suppliers).subscribe((items: Array<SupplierModel>) => {
      this.supplierList = items;
    })
  }

  ngOnDestroy(): void {
    if (this.supplierSubscription) {
      this.supplierSubscription.unsubscribe();
    }
  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      this.crudService.post(ROUTES_MODEL_CONFIG.suppliers, form.value).subscribe((id: Number) => {
        // console.log("inserted id:", id);
        this.supplierList.push(form.value);
        
      })
    } else {
      alert("Date incomplete!");
    }
  }

  onSelectRow(pos: ContextModel) {
    this.selectedRow = pos;
  }

  onChange(posName: string) {
    this.selectedRow.name = posName;
  }

  delete(pos: ContextModel, index) {
    // console.log(pos, index);
    this.crudService.delete(ROUTES_MODEL_CONFIG.contextes, pos.id).subscribe((id: number) => {
      this.supplierList.splice(index, 1);
    })
  }

  update(pos: ContextModel, index) {
    // console.log(pos, index, this.selectedRow);
    this.crudService.update(ROUTES_MODEL_CONFIG.contextes, this.selectedRow).subscribe((id: number) => {
    })
  }

}
