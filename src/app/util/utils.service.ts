import { Injectable } from '@angular/core';
import { client } from '../model/client';
import { contractor } from '../model/contractor';
import { design } from '../model/design';
import { color } from '../model/color';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public clientObj: client = new client();
  public contractorObj: contractor = new contractor();
  public designObj: design = new design();
  public colorObj: color = new color();

  public challanTypes = [{ val: "I", name: "Issue" }, { val: "R", name: "Recieve" }]
  constructor() { }

  public buildUrl(obj: any) {
    let search_url = '';
    Object.entries(obj).forEach(([key, value]) => {
      if (value) {
        if (!search_url) {
          search_url += `?${key}=${value}`
        } else {
          search_url += `&${key}=${value}`
        }
      }
    });
    return search_url;
  }

  public numberOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;

  }

  public formatDate_dd_MM_YYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  public getStatus(params: any) {

    let status = params.node.data.active ? '<span class="dot-green"></span>' : '<span class="dot-red"></span>';
    console.log('status ', status);
    return `${status}`;
  }

  public validateGST(gstNo: String) {
    return gstNo && gstNo.length < 15 ? true : false;
  }
}
