import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { contractor } from '../../model/contractor';
import { MasterDataService } from '../../service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridApi, GridReadyEvent } from "ag-grid-community";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomeCellComponent } from '../../util/custome-cell/custome-cell.component';
import { UtilsService } from '../../util/utils.service';
import { DownloadSerivceService } from '../../util/download-serivce.service';

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
  contractor: contractor[] = [];
  contractorObj: contractor = new contractor();
  private gridApi!: GridApi;
  private readonly downloadService = inject(DownloadSerivceService);


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

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<contractor>[] = [
    {
      headerName: "Status",
      cellClass: 'margin-top-8',
      sortable: false,
      filter: false,
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
    },
    {
      headerName: '',
      field: 'id',
      cellRenderer: CustomeCellComponent,
      sortable: false,
      filter: false,
      cellClass: 'align-center',
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
        this.contractor[0] = res;
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
        this.contractor = res.data;
        this.totalRecord = res.metadata.recordcount;
      })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  refreshData(newData: any[]): void {
    this.gridApi.applyTransaction({ add: this.contractor }) // Replace with new data
  }

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'contractor_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'contractor_data.xlsx')
  }

  getReportData() {
    return this.contractor.map(e => ({
      'Client Name': e.contractorName,
      'Email': e.email,
      'Mobile': e.mobile,
      'Address': e.address,
      'City': e.city,
      'GST Number': e.gstNo,
      'Status': e.active ? 'Active' : 'Inactive'
    }));
  }
}
