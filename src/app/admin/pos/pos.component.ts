import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContextModel } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from 'src/app/models/config.models';
import { CrudService } from '../../services/crud.service';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

  posList: ContextModel[];

  posSubscription: Subscription;

  selectedRow:ContextModel;

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.posSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.contextes).subscribe((items: Array<ContextModel>) => {
      this.posList = items;
    })
  }

  ngOnDestroy(): void {
    if (this.posSubscription) {
      this.posSubscription.unsubscribe();
    }
  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      this.crudService.post(ROUTES_MODEL_CONFIG.contextes, form.value).subscribe((id: Number) => {
        console.log("inserted id:", id);
        this.posList.push(form.value);
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
    console.log(pos, index);
    this.crudService.delete(ROUTES_MODEL_CONFIG.contextes, pos.id).subscribe((id: number) => {
      this.posList.splice(index, 1);
    })
  }

  update(pos: ContextModel, index) {
    console.log(pos, index, this.selectedRow);
    this.crudService.update(ROUTES_MODEL_CONFIG.contextes, this.selectedRow).subscribe((id: number) => {
    })
  }

}
