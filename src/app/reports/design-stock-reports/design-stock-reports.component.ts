import { Component, inject } from '@angular/core';

import { MasterDataService } from '../../service/master-data.service';
import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  CsvExportParams,
  GridReadyEvent,
} from 'ag-grid-community';
import {  GridApi } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { design } from '../../model/design';
import { color } from '../../model/color';
import { DownloadSerivceService } from '../../util/download-serivce.service';

@Component({
  selector: 'app-design-stock-reports',
  imports: [
    AgGridAngular,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgbTypeaheadModule,
  ],
  templateUrl: './design-stock-reports.component.html',
  styleUrl: './design-stock-reports.component.css',
})
export class DesignStockReportsComponent {
  filterObj: StockFilter = new StockFilter();
  masterDataService = inject(MasterDataService);
  downloadService = inject(DownloadSerivceService);
  utilsService: UtilsService = inject(UtilsService);
  designs: design[] = [];
  colors: color[] = [];
  private gridApi!: GridApi;
  reportData: ReportData[] = [];
  private url: string = 'designstockreports'

  totalRecord: number = 0;
  constructor(public router: ActivatedRoute, public route: Router) {
    this.getDesigns();
    this.getColors();
  }

  //fetch design list
  getDesigns = () => {
    this.masterDataService.getData('designs/').subscribe((res: any) => {
      this.designs = res.data;
      console.log('designs data ', this.designs);
    });
  };

  // fetch color list
  getColors = () => {  
    this.masterDataService.getData('colors/').subscribe((res: any) => {
      this.colors = res.data;     
    });
  };

  searchStock() {
    let url = ''
    url = this.url + this.utilsService.buildUrl(this.filterObj);
    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.reportData = res.data;
        this.totalRecord = res.metadata.recordcount;
      })
  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
  };
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<ReportData>[] = [   
    {
      headerName: 'Design Name',
      field: 'designName',
    },
    {
      headerName: 'Color Name',
      field: 'colorName',
    },
    {
      headerName: 'Stock Balance',
      field: 'stockBalance',
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onBtnExport() {
    // const params: CsvExportParams = {
    //   fileName: 'client_data.csv',
    //   //onlySelected: false,       // Export only selected rows
    //   //allColumns: true,         // Export all columns, even if not visible
    //   //columnKeys: ['name'],     // Export only specific columns
    // };

    // this.gridApi.exportDataAsCsv(params);
    //this.downloadService.exportToExcel();
  }
}
class StockFilter {
  designName: string;
  colorName: string;
  constructor() {
    this.designName = '';
    this.colorName = '';
  }
}

class ReportData {
  designName: string;
  colorName: string;
  stockBalance: number;
  constructor() {
    this.designName = '';
    this.colorName = '';
    this.stockBalance = 0;
  }
}