import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../pages/service/master-data.service';
import { contractor } from '../../model/contractor';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-create-contractor',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-contractor.component.html',
  styleUrl: './create-contractor.component.css'
})
export class CreateContractorComponent {

  id: string = '';
  action: string = '';
  url: string = 'contractors/';
  http = inject(HttpClient)
  contractorFromData = signal(new contractor())
  masterDataService = inject(MasterDataService)
   showSuccessMessage: boolean = false;
  successMessage: string = '';
  contractorObj: contractor = new contractor();

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']      
    });

    if (this.id) {
      this.masterDataService.findById(this.id, this.url)
        .subscribe((res: any) => {
          this.contractorObj = res;
        })
    }
  }

  onSave = () => {
    const formValue = this.contractorObj;
    this.masterDataService.saveContractor(formValue)
      .subscribe((res: any) => {
        if (res.status === 'success') {
         this.successMessage = 'Data saved successfully!';
                   this.showSuccessMessage = true;
                   this.contractorObj = new contractor();
                   setTimeout(() => {
                     this.showSuccessMessage = false;
                     this.successMessage = '';
                   }, 3000);
        } else {
          console.log(res.message)
        }
      })
  }

  ngOnDestroy(): void {

  }

  updateForm = (key: string, event: any) => {
    this.contractorFromData.update((data: contractor) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  cancel = () => {
    this.route.navigate(["/list-contractor"])
  }
}
