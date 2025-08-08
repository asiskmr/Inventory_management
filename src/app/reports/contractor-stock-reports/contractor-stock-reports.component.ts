import { Component, inject } from '@angular/core';
import { MasterDataService } from '../../service/master-data.service';
import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  CsvExportParams,
  GridReadyEvent,
} from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { contractor } from '../../model/contractor';
import { design } from '../../model/design';
import { color } from '../../model/color';
import { DownloadSerivceService } from '../../util/download-serivce.service';

@Component({
  selector: 'app-contractor-stock-reports',
  imports: [
    AgGridAngular,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgbTypeaheadModule,
  ],
  templateUrl: './contractor-stock-reports.component.html',
  styleUrl: './contractor-stock-reports.component.css',
})
export class ContractorStockReportsComponent {
  filterObj: StockFilter = new StockFilter();
  masterDataService = inject(MasterDataService);
  utilsService: UtilsService = inject(UtilsService);
  contractors: contractor[] = [];
  designs: design[] = [];
  colors: color[] = [];
  private gridApi!: GridApi;
  contractorStockData: ContractorStockData[] = [];
  private readonly downloadService = inject(DownloadSerivceService);
  private url: string = 'contractorstockreports/';

  totalRecord: number = 0;
  constructor(public router: ActivatedRoute, public route: Router) {
    this.getContractors();
    this.getDesigns();
    this.getColors();
  }

  // fetch the contractor list
  getContractors = () => {
    this.masterDataService.getData('contractors/').subscribe((res: any) => {
      this.contractors = res.data;
      console.log('designs data ', this.contractors);
    });
  };

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
      console.log('colors data ', this.colors);
    });
  };

  searchStock() {
    let url = ''
    url = this.url + this.utilsService.buildUrl(this.filterObj);
    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.contractorStockData = res.data;
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
  colDefs: ColDef<ContractorStockData>[] = [
    {
      headerName: 'Design Name',
      field: 'designName',
    },
    {
      headerName: 'Color Name',
      field: 'colorName',
    },
    {
      headerName: 'Contractor Name',
      field: 'contractorName',
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
    this.downloadService.exportToCSV(this.getReportData(), 'contractor_stock_report.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'contractor_stock_report.xlsx')
  }

  getReportData() {
    return this.contractorStockData.map(e => ({
      'Contractor Name': e.contractorName,
      'Design Name': e.designName,
      'Color Name': e.colorName,
      'Stock Balance': e.stockBalance
    }));
  }
}
class StockFilter {
  designName: string;
  colorName: string;
  contractorName: string;

  constructor() {
    this.designName = '';
    this.colorName = '';
    this.contractorName = '';
  }
}

class ContractorStockData {

  designName: string;
  colorName: string;
  contractorName: string;
  stockBalance: number;

  constructor() {
    this.designName = '';
    this.colorName = '';
    this.contractorName = '';
    this.stockBalance = 0;
  }
}