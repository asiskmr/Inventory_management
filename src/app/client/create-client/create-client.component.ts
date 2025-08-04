import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MasterDataService } from '../../service/master-data.service';
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

  private readonly http = inject(HttpClient)
  private readonly masterDataService = inject(MasterDataService);
  readonly utilsService = inject(UtilsService);

  private readonly route = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  id: string = '';
  action: string = '';
  url: string = 'clients/';
  clientObj: client = new client();  
  clientFromData = signal(new client())
  isValidGst: boolean = false;
  showStatus: boolean = false;
  constructor(public router: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
      this.showStatus = this.action ? true : false;
    });

    if (this.id) {
      this.loadClient(this.id);
    }
  }

  private loadClient(id: string): void {
    this.masterDataService.findById(id, this.url).subscribe({
      next: (res: any) => {
        this.clientObj = res;
      },
      error: (err) => {
        console.error('Error loading client:', err);
      }
    });
  }

  save(): void {
    this.masterDataService.save(this.url, this.clientObj).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.cancel();         
        } else {
          console.warn('Save failed:', res.message);
        }
      },
      error: (err) => {
        console.error('Save error:', err);
      }
    });
  }

  updateForm = (key: string, event: any) => {
    this.clientFromData.update((data: client) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  validateGst(){    
     this.isValidGst = this.utilsService.validateGST(this.clientObj.gstNo);
  }
  cancel = () => {
    this.route.navigate(["/list-client"])
  }
}
