import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

import { MasterDataService } from '../../pages/service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { provideGlobalGridOptions, GridApi } from 'ag-grid-community';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { challanItems } from '../../model/challanItems';
import { contractorChallan } from '../../model/contractorChallan';
import { contractor } from '../../model/contractor';
import { design } from '../../model/design';
import { color } from '../../model/color';
import { clientChallan } from '../../model/clientChallan';

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
  fromDate: Date = new Date();
  toDate: Date = new Date();
  designs: design[] = [];
  colors: color[] = [];
  private gridApi!: GridApi;
  clientChallans: clientChallan[] = [];

  totalRecord: number = 0;
  constructor(public router: ActivatedRoute, public route: Router) {
    this.getDesignts();
    this.getColors();
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
    this.filterObj.fromchallandate = this.fromDate ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    console.log(this.toDate, "filter data ", this.filterObj)
  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<clientChallan>[] = [
    // {
    //   headerName: "Id",
    //   field: "id",
    // },
    {
      headerName: "Challan Number",
      field: "challanNumber",
    },
    {
      headerName: "Challan Date",
      field: "challanDate",
    },
    {
      headerName: "Party",
      field: "client.clientName",
    },
    {
      headerName: "Client Mobile",
      field: "client.mobile",
    },
    // {
    //   headerName: "Challan Type",
    //   cellRenderer: this.challanType
    // },
    // {
    //   headerName: "Pices Count",
    //   cellRenderer: this.myCellRenderer
    // },
    // {
    //   headerName: 'Action',
    //   cellRenderer: this.myCellRenderer1,
    //   onCellClicked: (event) => {
    //     this.itemDetails = event.data?.challanItems;
    //   }     
    //}
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onBtnExport() {

    const params: CsvExportParams = {
      fileName: 'client_data.csv',
      //onlySelected: false,       // Export only selected rows
      // allColumns: true,         // Export all columns, even if not visible
      //columnKeys: ['name'],     // Export only specific columns
    };

    this.gridApi.exportDataAsCsv(params);
  }

}
class StockFilter {
  design: string;
  color: String;
  fromchallandate: String;
  tochallandate: String;

  constructor() {
    this.design = "";
    this.color = '';
    this.fromchallandate = '';
    this.tochallandate = '';

  }
}