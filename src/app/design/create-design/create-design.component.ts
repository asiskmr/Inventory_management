import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../pages/service/master-data.service';
import { client } from '../../model/client';
import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from '../../util/utils.service';
import { design } from '../../model/design';

@Component({
  selector: 'app-create-design',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-design.component.html',
  styleUrl: './create-design.component.css'
})
export class CreateDesignComponent {
  
  id: string = '';
  action: string = '';
  url: string = 'designs/';

  http = inject(HttpClient)
  designFromData = signal(new design())
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  designObj: design = new design();

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
          this.designObj = res;
        })
    }
  }

 

  onSave = () => {    
    this.masterDataService.save(this.url, this.designObj)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.route.navigate(["/list-design"])
        } else {
          console.log(res.message)
        }
      })
  }
  ngOnDestroy(): void {

  }
  updateForm = (key: string, event: any) => {
    this.designFromData.update((data: design) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  cancel = () => {
    this.route.navigate(["/list-design"])
  }
}
