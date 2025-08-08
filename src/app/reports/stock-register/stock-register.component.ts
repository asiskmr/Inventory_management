import { Component, inject, OnInit } from '@angular/core';

import { MasterDataService } from '../../service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { GridApi } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { design } from '../../model/design';
import { color } from '../../model/color';
import { stockRegisger } from '../../model/stockRegister';
import { DownloadSerivceService } from '../../util/download-serivce.service';

@Component({
  selector: 'app-stock-register',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule],
  templateUrl: './stock-register.component.html',
  styleUrl: './stock-register.component.css'
})
export class StockRegisterComponent {

  filterObj: StockFilter = new StockFilter();
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  private readonly downloadService = inject(DownloadSerivceService);
  designs: design[] = [];
  colors: color[] = [];
  private gridApi!: GridApi;
  stockRegister: stockRegisger[] = [];
  private url: string = 'designstockreports/'
  totalRecord: number = 0;
  constructor(public router: ActivatedRoute, public route: Router) {
    this.getDesignts();
    this.getColors();
    this.searchStock()
  }


  //fethc design list

  getDesignts = () => {
    this.masterDataService.getData('designs/')
      .subscribe((res: any) => {
        this.designs = res.data;
        console.log('designs data ', this.designs)
      })
  }

  // fetch color list
  getColors = () => {
    console.log(' marster data ', this.masterDataService)
    this.masterDataService.getData('colors/')
      .subscribe((res: any) => {
        this.colors = res.data;
        console.log('colors data ', this.colors)
      })
  }

  searchStock() {

    this.stockRegister = []
    let url = ''
    url = this.url + this.utilsService.buildUrl(this.filterObj)
    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.stockRegister = res.data;
        this.totalRecord = res.metadata.recordcount
        console.log('stock data ', this.stockRegister)
      })

  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<stockRegisger>[] = [
    {
      headerName: "Design",
      field: "designName",
    },
    {
      headerName: "Color",
      field: "colorName",
    },
    {
      headerName: "Stock Balance",
      field: "stockBalance",
    }
  ];
  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'stock_report.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'stock_report.xlsx')
  }

  getReportData() {
    return this.stockRegister.map(e => ({
      'Design Name': e.designName,
      'Color Name': e.colorName,
      'Stock Balance': e.stockBalance,
    }));
  }

}
class StockFilter {
  colorName: string;
  designName: String;

  constructor() {
    this.colorName = "";
    this.designName = '';
  }
}