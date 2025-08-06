import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MasterDataService } from '../../service/master-data.service';

import { FormsModule } from '@Angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsService } from '../../util/utils.service';
import { color } from '../../model/color';

@Component({
  selector: 'app-create-color',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-color.component.html',
  styleUrl: './create-color.component.css'
})
export class CreateColorComponent {

  id: string = '';
  action: string = '';
  url: string = 'colors/';
  http = inject(HttpClient)
  colorFromData = signal(new color())
  masterDataService = inject(MasterDataService)
  utilsService: UtilsService = inject(UtilsService);
  colorObj: color = new color();
  showStatus: boolean = false

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
      this.showStatus = this.action ? true : false;
    });

    if (this.id) {
      console.log(`${this.id} and url ${this.url}`)
      this.masterDataService.findById(this.id, this.url)
        .subscribe((res: any) => {
          this.colorObj = res;
        })
    }
  }

  onSave = () => {
    this.masterDataService.save(this.url, this.colorObj)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.cancel();
        } else {
          console.log(res.message)
        }
      })
  }
  ngOnDestroy(): void {

  }
  updateForm = (key: string, event: any) => {
    this.colorFromData.update((data: color) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  cancel = () => {
    this.route.navigate(["/list-color"])
  }
}
