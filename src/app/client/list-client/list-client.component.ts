import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { client } from '../../model/client';
import { MasterDataService } from '../../service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { provideGlobalGridOptions, GridApi } from 'ag-grid-community';
import { CustomeCellComponent } from '../../util/custome-cell/custome-cell.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';
import { DownloadSerivceService } from '../../util/download-serivce.service';

provideGlobalGridOptions({ theme: "legacy" });
@Component({
  selector: 'app-list-client',
  standalone: true,
  imports: [AgGridAngular, FormsModule, CommonModule],
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.css'
})
export class ListClientComponent implements OnInit {

  private readonly http = inject(HttpClient)
  private readonly masterDataService = inject(MasterDataService);
  readonly utilsService = inject(UtilsService);
  private readonly route = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly downloadService = inject(DownloadSerivceService);

  id: string = '';
  action: string = '';
  url: string = 'clients/';
  totalRecord: number = 0;
  clients: client[] = [];
  clientObj: client = new client();
  private gridApi!: GridApi;
  clientList$: Observable<client[]> = new Observable<client[]>;
  constructor(public router: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
      this.clientObj = this.utilsService.clientObj;
      this.searchClient();
    });
  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<client>[] = [
    {
      headerName: "Status",
      cellClass: 'margin-top-8',
      cellRenderer: this.utilsService.getStatus
    },
    {
      headerName: "Party",
      field: "clientName",
    },
    {
      headerName: "Mobile",
      field: "mobile",
    },
    {
      headerName: "Email",
      field: "email",
    }, {
      headerName: 'Action',
      field: 'id',
      cellRenderer: CustomeCellComponent,
      cellRendererParams: {
        page: { name: "client" }
      }
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };

  createClient = () => {
    this.route.navigate(["/create-client"])
  }

  deleteClient() {
    this.masterDataService.update(this.id, false, this.url)
      .subscribe((res: any) => {
        this.clients[0] = res;
        this.searchClient();
      })
  }

  searchClient = () => {
    this.clientObj.active = false;
    let url = ''
    url = this.url + this.utilsService.buildUrl(this.clientObj);
    this.utilsService.clientObj = this.clientObj;
    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.clients = res.data;
        this.totalRecord = res.metadata.recordcount;
      })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  refreshData(newData: any[]): void {
    this.gridApi.applyTransaction({ add: this.clients }) // Replace with new data
  }

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'client_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'client_data.xlsx')
  }

  getReportData() {
    return this.clients.map(e => ({
      'Client Name': e.clientName,
      'Email': e.email,
      'Mobile': e.mobile,
      'Address': e.address,
      'City': e.city,
      'GST Number': e.gstNo,
      'Status': e.active ? 'Active' : 'Inactive'
    }));
  }

}
