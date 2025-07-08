import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { contractor } from '../../model/contractor';
import { MasterDataService } from '../../pages/service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridApi, GridReadyEvent } from "ag-grid-community";
import { provideGlobalGridOptions } from 'ag-grid-community';

import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { CustomeCellComponent } from '../../util/custome-cell/custome-cell.component';
import { ICellRendererParams, IRowChildrenService } from 'ag-grid-enterprise';
import { UtilsService } from '../../util/utils.service';

@Component({
  selector: 'app-list-contractor',
  imports: [AgGridAngular, FormsModule, CommonModule],
  templateUrl: './list-contractor.component.html',
  styleUrl: './list-contractor.component.css'
})
export class ListContractorComponent {



  id: string = '';
  action: string = '';
  url: string = 'contractors/';
  http = inject(HttpClient)
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  clints: contractor[] = [];
  contractorObj: contractor = new contractor();
  private gridApi!: GridApi;


  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    //this.getContractorData();
    // debugger;
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']     
    });
  }

  getContractorData = () => {
    this.masterDataService.getContractor()
      .subscribe((res: any) => {
        this.clints = res;
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<contractor>[] = [
    {
      headerName: "Id",
      field: "id",
    },
    {
      headerName: "Contractor Name",
      field: "contractorName",
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
        page: { name: "customer" }
      }
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };

  contractorList$: Observable<contractor[]> = new Observable<contractor[]>;

  creatContractor = () => {
    this.route.navigate(["/create-contractor"])
  }

  deleteContractor() {

    this.masterDataService.updateContractor(this.id, false)
      .subscribe((res: any) => {
        this.clints[0] = res;

      })
    this.getContractorData();
    this.route.navigate(["/list-contractor"])
  }

  searchContractor = () => {
    this.url += this.utilsService.buildUrl(this.contractorObj);
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
      fileName: 'contractor_data.csv',
      //onlySelected: false,       // Export only selected rows
      // allColumns: true,         // Export all columns, even if not visible
      //columnKeys: ['name'],     // Export only specific columns
    };

    this.gridApi.exportDataAsCsv(params);
  }
}
