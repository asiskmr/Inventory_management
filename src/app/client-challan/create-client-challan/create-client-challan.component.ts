import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../pages/service/master-data.service';
import { clientChallan } from '../../model/clientChallan';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColumnGroupService, type ColDef, type CsvExportParams, type GridApi, type GridReadyEvent } from "ag-grid-community";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { client } from '../../model/client';
import { design } from '../../model/design';
import { color } from '../../model/color';
import { UtilsService } from '../../util/utils.service';

@Component({
  selector: 'app-create-client-challan',
  imports: [FormsModule, CommonModule, AgGridAngular, MatDatepickerModule,
    MatNativeDateModule, MatInputModule],
  templateUrl: './create-client-challan.component.html',
  styleUrl: './create-client-challan.component.css'
})

export class CreateClientChallanComponent {

  id: string = '';
  action: string = '';
  url: string = 'clientchallans/';
  http = inject(HttpClient)
  clientChallanFromData = signal(new clientChallan())
  masterDataService = inject(MasterDataService)
  clientChallanObj: clientChallan = new clientChallan();
  utilsService: UtilsService = inject(UtilsService);
  private gridApi!: GridApi;
  rowCnt: number;
  challanDate: Date = new Date();
  items: any[] = [];
  clients: client[] = [];
  designs: design[] = [];
  colors: color[] = [];
  disableAdd: boolean = true;
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  constructor(public router: ActivatedRoute, public route: Router) {
    this.rowCnt = 1;
    this.getClients();
    this.getDesignts();
    this.getColors();
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
    });

    if (this.id) {
      this.masterDataService.findById(this.id, this.url)
        .subscribe((res: any) => {
          this.clientChallanObj = res;
        })
    }
  }

  //fetch client list

  getClients = () => {
    this.masterDataService.getData('clients/')
      .subscribe((res: any) => {
        this.clients = res.data;
        console.log('client data ', this.clients)
      })
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


  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<any>[] = [
    {
      headerName: "Design",
      field: "designName",
    },
    {
      headerName: "Color",
      field: "colorName",
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      editable: true, // 👈 make this column editable
      cellEditor: 'agTextCellEditor' // default is already agTextCellEditor
    },
    {
      headerName: 'Action',
      cellRenderer: this.buttonRenderer,
      cellRendererParams: {
        onClick: this.onDeconsteItem.bind(this),
        label: 'Deconste'
      },
      width: 120
    }
  ];

  buttonRenderer(params: any): HTMLElement {
    const button = document.createElement('button');
    button.innerHTML = params.label || 'Click';
    button.classList.add('btn', 'btn-sm', 'btn-primary');
    button.addEventListener('click', () => params.onClick?.(params));
    return button;
  }

  onDeconsteItem(params: any) {
    const rowData = params.data;
    this.gridApi.applyTransaction({ remove: [rowData] });
    const index = this.items.findIndex(item => item.id === rowData.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    editable: false

  };

  onCellValueChanged(event: any): void {
    console.log('Cell changed:', event);   
  }

  onSave = () => {
    const obj = this.buildRequestObject();
    console.log('boj :: ', obj)
    this.masterDataService.save(this.url, obj).subscribe((res: any) => {
        if (res.status === 'success') {
          this.successMessage = 'Data saved successfully!';
          this.showSuccessMessage = true;
          this.clientChallanObj = new clientChallan();
          this.items = [];
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.successMessage = '';
          }, 3000);
        } else {
          console.log(res.message)
        }
      })
  }

  private buildRequestObject(): any {
    return {
      challanNumber: this.clientChallanObj.challanNumber,
      challanDate: this.utilsService.formatDate_dd_MM_YYYY(this.challanDate),
      client: { id: this.clientChallanObj.party },
      challanType: this.clientChallanObj.challanType,
      challanItems: this.items.map(item => ({
        design: { id: item.designId },
        color: { id: item.colorId },
        quantity: item.quantity
      }))
    };
  }

  updateForm = (key: string, event: any) => {
    this.clientChallanFromData.update((data: clientChallan) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  cancel = () => {
    this.route.navigate(["/list-clientChallan"])
  }

  getDesignName = (id: number) => {
    return this.designs.filter(e => e.id == id)[0].designName;
  }
  getColorName = (id: number) => {
    return this.colors.filter(e => e.id == id)[0].colorName;
  }

  onGridReady(params: GridReadyEvent): void {
    console.log('calling on grid ready function')
    this.gridApi = params.api;
  }

  getRowId(params: any): string {
    return params.data.id// `${params.data.designId}-${params.data.colorId}`;
  }

  addItems = () => {

    const { design, color, quantity } = this.clientChallanObj;
    const newItem = {
      id: this.rowCnt++,
      designId: design,
      designName: this.getDesignName(design),
      colorId: color,
      colorName: this.getColorName(color),
      quantity
    }

    this.items.push(newItem);
    console.log(this.clientChallanObj, 'this.items', this.items)
    this.gridApi.applyTransaction({ remove: this.items });
    this.gridApi.applyTransaction({ add: this.items });
    this.clearItemInputs();
  }

  clearItemInputs() {
    this.clientChallanObj.design = 0;
    this.clientChallanObj.color = 0
    this.clientChallanObj.quantity = 0
    this.disableAdd = true;
  }

  onInputBlur(): void {
    const { design, color, quantity } = this.clientChallanObj;
    this.disableAdd = !(design && color && quantity);
  }

  challanTypes = [{ val: "I", name: "Issue" }, { val: "R", name: "Recieve" }]

}

