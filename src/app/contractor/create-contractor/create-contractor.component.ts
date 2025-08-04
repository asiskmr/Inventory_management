import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../service/master-data.service';
import { contractor } from '../../model/contractor';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from '../../util/utils.service';

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
  isValidGst: boolean = false;
  http = inject(HttpClient)
  contractorFromData = signal(new contractor())
  readonly utilsService = inject(UtilsService);
  masterDataService = inject(MasterDataService)
  contractorObj: contractor = new contractor();
  showStatus: boolean = false;
  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
      this.showStatus = this.action ? true : false;
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
          this.cancel()
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
validateGst(){
     this.isValidGst = this.utilsService.validateGST(this.contractorObj.gstNo);
  }
  cancel = () => {
    this.route.navigate(["/list-contractor"])
  }
}
