import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { contractor } from '../../model/contractor';
import { MasterDataService } from '../../service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridApi, GridReadyEvent } from "ag-grid-community";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { CustomeCellComponent } from '../../util/custome-cell/custome-cell.component';
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
  totalRecord: number = 0;
  http = inject(HttpClient)
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  clints: contractor[] = [];
  contractorObj: contractor = new contractor();
  private gridApi!: GridApi;


  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
      this.contractorObj = this.utilsService.contractorObj
      this.searchContractor()
    });
  }

  // getContractorData = () => {
  //   this.masterDataService.getContractor()
  //     .subscribe((res: any) => {
  //       this.clints = res.data;
  //       this.totalRecord = res.metadata.recordcount;
  //     })

  // }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<contractor>[] = [
    {
      headerName: "Status",
      cellClass: 'margin-top-8',
      cellRenderer: this.utilsService.getStatus,

    },
    {
      headerName: "Contractor Name",
      field: "contractorName",
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
    this.searchContractor();
    this.route.navigate(["/list-contractor"])
  }

  searchContractor = () => {
    this.contractorObj.active = false;
    let url = ''
    this.utilsService.contractorObj = this.contractorObj;
    url = this.url + this.utilsService.buildUrl(this.contractorObj);
    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.clints = res.data;
        this.totalRecord = res.metadata.recordcount;
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
