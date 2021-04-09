import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextModel, NecessaryModel, NecessaryExportModel } from 'src/app/models/app.model';
import { ROUTES_MODEL_CONFIG } from 'src/app/models/config.models';
import { CrudService } from '../../services/crud.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

  posList: ContextModel[];

  posSubscription: Subscription;
  necessaryExportSubscription: Subscription;

  selectedRow: ContextModel;

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
    if (this.necessaryExportSubscription) {
      this.necessaryExportSubscription.unsubscribe();
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

  exportNecessary() {
    console.log("EXPORT");
    let exportNecessaryList: NecessaryExportModel[] = [];
    this.necessaryExportSubscription = this.crudService.get(ROUTES_MODEL_CONFIG.necessaries).subscribe((items: Array<NecessaryModel>) => {
      console.log("export", items);

      items.forEach((item) => {
        let necessaryExportModelItem: NecessaryExportModel = {
          product: item[0].name,
          producer: item[0].producer.name,
          necessary: item[1],
          data: new Date (Date.parse(item[4])),
          context: item[7]

        }

        exportNecessaryList.push(necessaryExportModelItem);
      })

       /* table id is passed over here */   
       let element = document.getElementById('posTable'); 
       const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(exportNecessaryList);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
    })


  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'necesar.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('posTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

}
