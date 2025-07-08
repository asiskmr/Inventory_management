import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, NgbModalModule ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
@Input() title: string = '';
  @Input() message: string = '';
  @Input() btnOkText: string = '';
  @Input() btnCancelText: string = '';

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
