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

@Component({
  selector: 'app-list-contractor-challan',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule],
  templateUrl: './list-contractor-challan.component.html',
  styleUrl: './list-contractor-challan.component.css'
})
export class ListContractorChallanComponent {


  id: string = '';
  action: string = '';
  url: string = 'contractorchallans/';
  totalRecord: number = 0;
  http = inject(HttpClient)
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  contractorChallans: contractorChallan[] = [];
  contractorChallanObj: contractorChallan = new contractorChallan();
  private gridApi!: GridApi;
  contractors: contractor[] = [];
  dropdownData: contractor[] = [];
  itemDetails: challanItems[] | undefined = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filterObj: challanFilter = new challanFilter();

  constructor(public router: ActivatedRoute, public route: Router) {
    this.getClients();
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
    });
  }

  getClients = () => {
    this.masterDataService.getData('contractors/')
      .subscribe((res: any) => {
        this.contractors = res.data;
        this.dropdownData = this.contractors;

        console.log('client data ', this.contractors)
      })
  }

  getClientData = () => {
    this.masterDataService.getData(this.url)
      .subscribe((res: any) => {
        this.contractorChallans = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<contractorChallan>[] = [
    {
      headerName: "Id",
      field: "id",
    },
    {
      headerName: "Challan Number",
      field: "challanNumber",
    },
    {
      headerName: "Challan Date",
      field: "challanDate",
    },
    {
      headerName: "Contractor Name",
      field: "contractor.contractorName",
    },
    {
      headerName: "Contractor Mobile",
      field: "contractor.mobile",
    },
    {
      headerName: "Challan Type",
      field: "challanType",
    },
    {
      headerName: "Pices Count",
      cellRenderer: this.myCellRenderer
    },
    {
      headerName: 'Action',
      cellRenderer: this.myCellRenderer1,
      onCellClicked: (event) => {
        this.itemDetails = event.data?.challanItems;
      }
    }
  ];




  myCellRenderer(params: any) {
    let totalQuantity = 0;
    console.log('Cell value:', params.node.data.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity)); // This should log the value
    return `<span>${totalQuantity}</span>`;
  }

  myCellRenderer1(params: any) {
    return `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> View </button>`;
  }



  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };

  deleteClient() {
    this.masterDataService.update(this.id, false, this.url)
      .subscribe((res: any) => {
        this.contractorChallans[0] = res;

      })
    this.getClientData();
    this.route.navigate(["/list-client"])
  }

  searchClientChallan = () => {
    console.log('search obj ', this.filterObj)

    this.filterObj.fromchallandate = this.fromDate ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    let url = '';
    url = this.url + this.utilsService.buildUrl(this.filterObj);
    console.log('url ', url)
    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.contractorChallans = res.data;
        this.totalRecord = res.metadata.recordcount;
      })
    console.log(' this.contractorChallans ', this.contractorChallans)
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        term.length < 2 ? of([]) : this.http.get<contractor[]>(`contractors/?contractorName=${term}`)
      )
    );

  formatter = (result: any) => result.clientName;

  // search = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     switchMap(term => term.length < 2 ? [] : ['Red', 'Green', 'Blue', 'Yellow'].filter(
  //       v => v.toLowerCase().indexOf(term.toLowerCase()) > -1
  //     ))
  //   );

  // formatter = (result: string) => result;

  filterData(event: any) {
    this.dropdownData = this.contractors.filter(e => e.contractorName.includes(event.target.value.toUpperCase()))
  }

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

  //=================Items details =============

  itemDetailsColDefs: ColDef<challanItems>[] = [
    {
      headerName: "Id",
      field: "id",
    },
    {
      headerName: "Design Name",
      field: "design.designName",
    },
    {
      headerName: "Color Name",
      field: "color.colorName",
    },
    {
      headerName: "Quantity",
      field: "quantity",
    }
  ];

}

class challanFilter {
  challannumber: string;
  contractorid: String;
  fromchallandate: String;
  tochallandate: String;
  challantype: number;

  constructor() {
    this.challannumber = "";
    this.contractorid = '';
    this.fromchallandate = '';
    this.tochallandate = '';
    this.challantype = 0;
  }
}