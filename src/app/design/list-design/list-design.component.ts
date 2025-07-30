import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { client } from '../../model/client';
import { MasterDataService } from '../../service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { GridApi } from 'ag-grid-community';
import { CustomeCellComponent } from '../../util/custome-cell/custome-cell.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';
import { design } from '../../model/design';

@Component({
  selector: 'app-list-design',
  imports: [AgGridAngular, FormsModule, CommonModule],
  templateUrl: './list-design.component.html',
  styleUrl: './list-design.component.css'
})
export class ListDesignComponent implements OnInit{

  id: string = '';
  action: string = '';
  url: string = 'designs/';

  http = inject(HttpClient)
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  designList: design[] = [];
  designObj: design = new design();
  private gridApi!: GridApi;
  totalRecord: number = 0;

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']     
    });
  }

  getDesignData = () => {
    this.masterDataService.getData(this.url)
      .subscribe((res: any) => {
        this.designList = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<design>[] = [
    {
      headerName: "Status", 
      cellClass: 'margin-top-8',    
      cellRenderer: this.utilsService.getStatus
    },
    {
      headerName: "Desing Name",
      field: "designName",
    },
    {
      headerName: "Description",
      field: "description",
    },
    {
      headerName: 'Action',
      field: 'id',
      cellRenderer: CustomeCellComponent,
      cellRendererParams: {
        page: { name: "design" }
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

  
  deleteDesign() {

    this.masterDataService.update(this.id, false, this.url)
      .subscribe((res: any) => {
        this.designList[0] = res;
      })
    this.getDesignData();
    this.route.navigate(["/list-design"])
  }

  searchDesign = () => {
   // this.url += this.utilsService.buildUrl(this.designObj);
     let url = ''
    url = this.url +this.utilsService.buildUrl(this.designObj);

    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.designList = res.data;
        this.totalRecord = res.metadata.recordcount
      })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtnExport() {

    const params: CsvExportParams = {
      fileName: 'design_data.csv',
      //onlySelected: false,       // Export only selected rows
      // allColumns: true,         // Export all columns, even if not visible
      //columnKeys: ['name'],     // Export only specific columns
    };

    this.gridApi.exportDataAsCsv(params);
  }
}
