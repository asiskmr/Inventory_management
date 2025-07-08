import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { vehicle } from '../../model/vehicle';
import { color } from '../../model/color';
import { MasterDataService } from '../service/master-data.service';

@Component({
  selector: 'app-color',
  imports: [],
  templateUrl: './color.component.html',
  styleUrl: './color.component.css'
})
export class ColorComponent {

  http = inject(HttpClient)
    masterDataservice = inject(MasterDataService)
  
    colorFromData = signal(new color())
    carList$: Observable<vehicle[]> = new Observable<vehicle[]>;
   
    constructor() {
     
    }
  
    ngOnDestroy(): void {
     
     }
    
    updateForm = (key: string, event: any) => {
      this.colorFromData.update((data: color) =>
        ({ ...data, [key]: event.target.value })
      )
    }
  
    onSaveColor = () => {
  
      // this.masterDataservice.saveColor(this.colorFromData())
      //   .subscribe((res: any) => {
      //     if (res.result) {
      //       alert('vehicle created success fully')
      //     } else {
      //       alert(res.message)
      //     }
      //   })
    }
}
