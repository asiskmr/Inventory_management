import { JsonPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, resource } from '@angular/core';

@Component({
  selector: 'app-customer',
  imports: [],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent{

 

  
//  customerList = resource({
//   loader: () => {
//     return fetch(`${this.apiUrl}GetCustomers`)
//     .then((res: any) => res.json() as Promise<any>)
//   },
//  // equal: //decide when to call loader function return true call loader
//  })

//  reload = ()=>{
//   this.customerList.reload()
//  }

}
