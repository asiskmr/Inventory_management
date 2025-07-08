import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { vehicle } from '../../model/vehicle';
import { client } from '../../model/client';
import { contractor } from '../../model/contractor';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService implements OnInit {

  apiUrl: string | undefined;
  configData: any;

   http = inject(HttpClient)
  carList$: Observable<vehicle[]> = new Observable<vehicle[]>;

  constructor() {
    
    this.getJSON().subscribe(data => {
      this.configData = data;
      this.apiUrl = this.configData[0].apiUrl;     
    });
  }

  ngOnInit(): void {   
  }

  public getJSON(): Observable<any> {
    return this.http.get("assets/config/environment.json");
  }


  getData = (url: string) => {   
    return this.http.get<client[]>(`${this.apiUrl}${url}`)
      .pipe(map((result: any) => {
        return result.data
      }))
  }

  findById = (id: string, url: string) => {
    return this.http.get<client[]>(`${this.apiUrl}${url}${id}`)
      .pipe(map((result: any) => {
        return result.data
      }))
  }

  save = (url: string, obj: any) => {
    return this.http.post(`${this.apiUrl}${url}`, obj);
  }

  update = (id: string, status: boolean, url: string) => {
    return this.http.patch(`${this.apiUrl}${url}${id}/${status}`, null);
  }

  search = (url: string) => {    
       return this.http.get<client[]>(`${this.apiUrl}${url}`)
      .pipe(map((result: any) => {
        return result.data
      }))
  }

  //======= Contractor calls

  getContractor = () => {
    return this.http.get<contractor[]>(`${this.apiUrl}contractors/`)
      .pipe(map((result: any) => {
        return result.data
      }))
  }

  getContractorById = (id: string) => {
    return this.http.get<contractor[]>(`${this.apiUrl}contractors/id/${id}`)
      .pipe(map((result: any) => {
        return result.data
      }))
  }

  saveContractor = (contractorObj: contractor) => {
    return this.http.post(`${this.apiUrl}contractors/`, contractorObj);
  }

  updateContractor = (id: string, status: boolean) => {
    return this.http.patch(`${this.apiUrl}contractors/${id}/${status}`, null);
  }
  searchContractor = (contractorObj: contractor) => {
    return this.http.get<contractor[]>(`${this.apiUrl}/contractors/email/mobile/gstno/status?email=${contractorObj.email}`)
      .pipe(map((result: any) => {
        return result.data
      }))
  }

}
