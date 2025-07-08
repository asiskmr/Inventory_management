import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../pages/service/master-data.service';
import { client } from '../../model/client';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from '../../util/utils.service';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-client.component.html',
  styleUrl: './create-client.component.css'
})
export class CreateClientComponent implements OnInit {

  id: string = '';
  action: string = '';
  url: string = 'clients/';

  http = inject(HttpClient)
  clientFromData = signal(new client())
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    debugger;
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']     
    });

    if (this.id) {
    
      this.masterDataService.findById(this.id, this.url)
        .subscribe((res: any) => {
          this.clientObj = res;
        })
    }
  }

  clientObj: client = new client();

  onSave = () => {
    this.masterDataService.save(this.url, this.clientObj)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.route.navigate(["/list-client"])
        } else {
          console.log(res.message)
        }
      })
  }

  ngOnDestroy(): void {

  }

  updateForm = (key: string, event: any) => {
    this.clientFromData.update((data: client) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  cancel = () => {
    this.route.navigate(["/list-client"])
  }
}
