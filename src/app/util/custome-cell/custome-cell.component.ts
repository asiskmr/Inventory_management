import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custome-cell',
  imports: [],
  templateUrl: './custome-cell.component.html',
  styleUrl: './custome-cell.component.css'
})
export class CustomeCellComponent implements ICellRendererAngularComp {

  param: any = '';
  http = inject(HttpClient)
  pageList: any;
  pageData: any;

  constructor(public router: Router) {
    this.getJSON().subscribe(data => {
      this.pageList = data;
      this.pageList.forEach((page: any) => {
        if (page[this.param.page.name]) {
          this.pageData = page[this.param.page.name];
        }
      });
    });
  }

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
    this.param = params
  }

  refresh(params: ICellRendererParams) {
    const delay = 50;
    const start = Date.now();
    while (Date.now() - start < delay) {
      // Busy-waiting loop to simulate a delay
    }
    return true;
  }
  public getJSON(): Observable<any> {
    return this.http.get("assets/config/pageInf.json");
  }


  editClient() {
   
    this.router.navigate([this.pageData.new], { queryParams: { id: this.param.data.id, status: this.param.data.active, action: 'edit', page: this.param.page.name } })
  }

  deleteClient() {
    this.router.navigate([this.pageData.list], { queryParams: { id: this.param.data.id, status: this.param.data.active, action: 'edit', page: this.param.page.name } })
  }

  viewClient(): void {
    
    this.router.navigate([this.pageData.new], { queryParams: { id: this.param.data.id, status: this.param.data.active, action: 'view', page: this.param.page.name } });
  }
}
