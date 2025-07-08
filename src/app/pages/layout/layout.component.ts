import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {



  @ViewChild('search') serch: ElementRef | any;

  // constructor(){
  //   debugger
  //   this.masterService.searchData.subscribe((res: any) =>{     
  //     if(res === ''){       
  //       this.serch.nativeElement['value'] = "";
  //     }
  //   })
  // }
  // searchText(event: any){
  //   debugger
  //   let val = this.serch.nativeElement['value'];
  //   this.masterService.searchData.next(val)
  // }

  clickTest(event: any){
    console.log('click test function call ', event)
  }
}
