import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../service/master-data.service';
import { clientChallan } from '../../model/clientChallan';
import { FormsModule } from '@angular/forms';
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
import { contractorChallan } from '../../model/contractorChallan';
import { contractor } from '../../model/contractor';
import { challanFilter } from '../../model/challanFilter';

@Component({
  selector: 'app-create-contractor-challan',
  imports: [FormsModule, CommonModule, AgGridAngular, MatDatepickerModule,
    MatNativeDateModule, MatInputModule],
  templateUrl: './create-contractor-challan.component.html',
  styleUrl: './create-contractor-challan.component.css'
})
export class CreateContractorChallanComponent {


  id: string = '';
  action: string = '';
  url: string = 'contractorchallans/';
  http = inject(HttpClient)
  clientChallanFromData = signal(new clientChallan())
  masterDataService = inject(MasterDataService)
  contractorChallanObj: contractorChallan = new contractorChallan();
  utilsService: UtilsService = inject(UtilsService);
  private gridApi!: GridApi;
  rowCnt: number;
  challanDate: Date = new Date();
  rowId: string = '';
  items: any[] = [];
  constructors: contractor[] = [];
  designs: design[] = [];
  colors: color[] = [];
  disableAdd: boolean = true;
  isItemExist: boolean = false;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  isDuplicateChallan: boolean = false;
  filterObj: challanFilter = new challanFilter();


  constructor(public router: ActivatedRoute, public route: Router) {
    this.rowCnt = 1;
    this.getContractor();
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
          this.contractorChallanObj = res;
        })
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  //fetch client list

  getContractor = () => {
    this.masterDataService.getData('contractors/')
      .subscribe((res: any) => {
        this.constructors = res.data;
        console.log('client data ', this.constructors)
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
      sortable: false,
      filter: false,
      cellRenderer: this.buttonRenderer,
      cellRendererParams: {
        onClick: this.onButtonClick.bind(this),
        label: 'Delete'
      },
      width: 120
    }
  ];
  buttonRenderer(params: any): HTMLElement {
    const button = document.createElement('button');
    button.innerHTML = params.label || 'Click';
    button.classList.add('btn', 'btn-sm', 'btn-primary'); // optional Bootstrap classes
    button.addEventListener('click', () => {
      if (params.onClick) {
        params.onClick(params);
      }
    });
    return button;
  }

  onButtonClick(params: any) {
    const rowData = params.data;
    console.log('Button clicked for row:', rowData);

    // Example: remove the row
    this.gridApi.applyTransaction({ remove: [rowData] });

    let index = this.items.findIndex(obj => obj.id === rowData.id);
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
    console.log(this.items, 'New row data:', event.data); // updated row
  }

  save = () => {

    let obj = this.buildReqObj();
    console.log(this.url, 'boj :: ', obj)
    this.masterDataService.save(this.url, obj)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.items = [];
          this.cancel();

        } else {
          console.log(res.message)
        }
      })
  }
  onChallanNumberChange() {
    const isChallanSame = this.filterObj.challannumber == this.contractorChallanObj.challanNumber
    this.isDuplicateChallan = isChallanSame ? true : false;
  }

  onSave = () => {

    this.filterObj.challannumber = this.contractorChallanObj.challanNumber
    let finalUrl = this.url + this.utilsService.buildUrl(this.filterObj);
    this.masterDataService.search(finalUrl)
      .subscribe((res: any) => {
        if (res.data.length <= 0) {
          this.save()
        } else {
          this.isDuplicateChallan = true
        }
      })
  }

  buildReqObj = () => {
    console.log('challanDate ', this.challanDate)
    let obj = {
      "challanNumber": this.contractorChallanObj.challanNumber,
      "challanDate": this.utilsService.formatDate_dd_MM_YYYY(this.challanDate),
      "contractor": {
        "id": this.constructors.find(e => e.contractorName == this.contractorChallanObj.party)?.id
      },
      "challanType": this.contractorChallanObj.challanType,
      "challanItems": this.buildItemsData()
    }
    return obj;
  }

  buildItemsData = () => {
    let arr: any = []

    this.items.forEach(e => {
      console.log(e)
      arr.push({
        design: { id: e.designId },
        color: { id: e.colorId },
        quantity: e.quantity,
      });
    });
    return arr;
  }

  ngOnDestroy(): void {

  }

  updateForm = (key: string, event: any) => {
    this.clientChallanFromData.update((data: clientChallan) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  cancel = () => {
    this.route.navigate(["/list-contractor-challan"])
  }

  getDesignName = (id: number) => {
    return this.designs.filter(e => e.id == id)[0].designName;
  }
  getColorData = (id: number) => {
    return this.colors.filter(e => e.id == id)[0].colorName;
  }

  onGridReady(params: GridReadyEvent): void {
    console.log('calling on grid ready function')
    this.gridApi = params.api;
  }

  getRowId(params: any): string {
    return params.data.id// `${params.data.designId}-${params.data.colorId}`;
  }

  itemExist() {
    return this.items.some(e => e.designId == this.contractorChallanObj.design && e.colorId == this.contractorChallanObj.color)
  }

  addItems = () => {

    if (this.itemExist()) {
      this.isItemExist = true;
    } else {

      this.items.push({
        'id': this.rowCnt++,
        'designId': this.contractorChallanObj.design,
        'designName': this.getDesignName(this.contractorChallanObj.design),
        'colorId': this.contractorChallanObj.color,
        'colorName': this.getColorData(this.contractorChallanObj.color),
        'quantity': this.contractorChallanObj.quantity
      })
      console.log(this.contractorChallanObj, 'this.items', this.items)
      this.gridApi.applyTransaction({ remove: this.items });
      this.gridApi.applyTransaction({ add: this.items });
      this.clearItems();
      this.isItemExist = false;
    }
  }

  clearItems() {
    this.contractorChallanObj.design = 0;
    this.contractorChallanObj.color = 0
    this.contractorChallanObj.quantity = 0
    this.disableAdd = true;
  }

  onInputBlur = () => {
    this.contractorChallanObj.quantity = Number(this.contractorChallanObj.quantity)
    this.isItemExist = this.itemExist();
    const { design, color, quantity } = this.contractorChallanObj;
    quantity
    this.disableAdd = !(design && color && quantity > 0 && !this.isItemExist);

  }
  challanTypes = [{ val: "I", name: "Issue" }, { val: "R", name: "Recieve" }]
}

