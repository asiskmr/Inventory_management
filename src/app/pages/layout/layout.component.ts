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
 
  clickTest(event: any){
    console.log('click test function call ', event)
  }
}
