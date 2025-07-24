import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { client } from '../../model/client';
import { MasterDataService } from '../../pages/service/master-data.service';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { GridApi } from 'ag-grid-community';
import { CustomeCellComponent } from '../../util/custome-cell/custome-cell.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../util/utils.service';
import { color } from '../../model/color';

@Component({
  selector: 'app-list-color',
  imports: [AgGridAngular, FormsModule, CommonModule],
  templateUrl: './list-color.component.html',
  styleUrl: './list-color.component.css'
})
export class ListColorComponent implements OnInit {



  id: string = '';
  action: string = '';
  totalRecord: number = 0;
  url: string = 'colors/';

  http = inject(HttpClient)
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  colorList: color[] = [];
  colorObj: color = new color();
  private gridApi!: GridApi;

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
    });
  }

  getcolorData = () => {
    this.masterDataService.getData(this.url)
      .subscribe((res: any) => {
        this.colorList = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<color>[] = [
    {
      headerName: "Status", 
      cellClass: 'margin-top-8',    
      cellRenderer: this.utilsService.getStatus
    },
    {
      headerName: "Color Name",
      field: "colorName",
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
        page: { name: "color" }
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


  deletecolor() {

    this.masterDataService.update(this.id, false, this.url)
      .subscribe((res: any) => {
        this.colorList[0] = res;
      })
    this.getcolorData();
    this.route.navigate(["/list-color"])
  }

  searchcolor = () => {
    this.colorList = []    
    let url = ''
    url = this.url + this.utilsService.buildUrl(this.colorObj);
    this.masterDataService.search(url)
      .subscribe((res: any) => {
        this.colorList = res.data;
        this.totalRecord = res.metadata.recordcount
      })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtnExport() {

    const params: CsvExportParams = {
      fileName: 'color_data.csv',
      //onlySelected: false,       // Export only selected rows
      // allColumns: true,         // Export all columns, even if not visible
      //columnKeys: ['name'],     // Export only specific columns
    };

    this.gridApi.exportDataAsCsv(params);
  }
}
