import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { client } from '../../model/client';
import { MasterDataService } from '../../pages/service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { provideGlobalGridOptions, GridApi } from 'ag-grid-community';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';
import { clientChallan } from '../../model/clientChallan';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { challanItems } from '../../model/challanItems';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-list-client-challan',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, NgSelectModule],
  templateUrl: './list-client-challan.component.html',
  styleUrl: './list-client-challan.component.css'
})
export class ListClientChallanComponent {

  id: string = '';
  action: string = '';
  url: string = 'clientchallans/';
  totalRecord: number = 0;
  http = inject(HttpClient)
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  clientChallans: clientChallan[] = [];
  clientChallanObj: clientChallan = new clientChallan();
  private gridApi!: GridApi;
  clients: client[] = [];
  dropdownData: client[] = [];
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
    this.masterDataService.getData('clients/')
      .subscribe((res: any) => {
        this.clients = res.data;
        this.dropdownData = this.clients;

        console.log('client data ', this.clients)
      })
  }

  getClientData = () => {
    this.masterDataService.getData(this.url)
      .subscribe((res: any) => {
        this.clientChallans = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

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
    {
      headerName: "Challan Type",
      cellRenderer: this.challanType
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

  challanType(params: any){
    console.log(' params.node.data.challanType ', params.node.data.challanType)
    return `<span> ${params.node.data.challanType == 'R'? 'Recieve': 'Issue'} </span>`
  }
    

  myCellRenderer(params: any) {
    let totalQuantity = 0;
    console.log('Cell value:', params.node.data.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity)); // This should log the value
    return `<span>${totalQuantity}</span>`;
  }

  myCellRenderer1(params: any) {     
        return `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> <i class="bi bi-pencil-square"></i> </button>`;
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
        this.clientChallans[0] = res;

      })
    this.getClientData();
    this.route.navigate(["/list-client"])
  }

  searchClientChallan = () => {
    this.filterObj.fromchallandate = this.fromDate ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    console.log('search obj ', this.filterObj)
    let finalUrl = '';
    finalUrl = this.url + this.utilsService.buildUrl(this.filterObj);

    this.masterDataService.search(finalUrl)
      .subscribe((res: any) => {
        this.clientChallans = res.data;
        this.totalRecord = res.metadata.recordcount;
      })
    console.log(' this.clientChallans ', this.clientChallans)
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        term.length < 2 ? of([]) : this.http.get<client[]>(`clients/?clientName=${term}`)
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

  selectedParty(party: any){
   
    const obj = this.dropdownData.find(e => e.clientName===party);    
    this.filterObj.clientid = obj?.id != undefined ? obj?.id+'' : '';
  }
  filterData(event: any) {
    this.dropdownData = this.clients.filter(e => e.clientName.includes(event.target.value.toUpperCase()))
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
  clientid: string;
  fromchallandate: string;
  tochallandate: string;
  challantype: number;

  constructor() {
    this.challannumber = "";
    this.clientid = '';
    this.fromchallandate = '';
    this.tochallandate = '';
    this.challantype = 0;
  }
}