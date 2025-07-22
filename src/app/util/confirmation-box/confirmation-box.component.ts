import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../pages/service/master-data.service';
import { client } from '../../model/client';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-box',
  imports: [],
  templateUrl: './confirmation-box.component.html',
  styleUrl: './confirmation-box.component.css'
})
export class ConfirmationBoxComponent {

  id: string = '';
  action: string = '';

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
      console.log(params['status'], ' ::  id :: ', this.id);
    });
  }

  deleteClient = () =>{
    console.log('delete confirmation :: ', this.id)
  }
}
