import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { client } from '../../model/client';
import { MasterDataService } from '../../pages/service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { provideGlobalGridOptions, GridApi } from 'ag-grid-community';
import { CustomeCellComponent } from '../../util/custome-cell/custome-cell.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';

provideGlobalGridOptions({ theme: "legacy" });


@Component({
  selector: 'app-list-client',
  standalone: true,
  imports: [AgGridAngular, FormsModule, CommonModule],
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.css'
})
export class ListClientComponent implements OnInit {


  id: string = '';
  action: string = '';
  url: string = 'clients/';

  http = inject(HttpClient)
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  clints: client[] = [];
  clientObj: client = new client();
  private gridApi!: GridApi;

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    //this.getClientData();
    //debugger;
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']     
    });
  }

  getClientData = () => {
    this.masterDataService.getData(this.url)
      .subscribe((res: any) => {
        this.clints = res;
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<client>[] = [
    {
      headerName: "Id",
      field: "id",
    },
    {
      headerName: "Client Name",
      field: "clientName",
    },
    {
      headerName: "Address",
      field: "address",
    },
    {
      headerName: "City",
      field: "city",
    },
    {
      headerName: "State",
      field: "state",
    },
    {
      headerName: "Country",
      field: "country",
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

  clientList$: Observable<client[]> = new Observable<client[]>;

  creatClient = () => {
    this.route.navigate(["/create-client"])
  }

  deleteClient() {

    this.masterDataService.update(this.id, false, this.url)
      .subscribe((res: any) => {
        this.clints[0] = res;

      })
    this.getClientData();
    this.route.navigate(["/list-client"])
  }

  searchClient = () => {
    this.url += this.utilsService.buildUrl(this.clientObj);
    this.masterDataService.search(this.url)
      .subscribe((res: any) => {
        this.clints = res;
      })
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
}
