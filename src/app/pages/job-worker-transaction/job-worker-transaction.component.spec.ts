import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkerTransactionComponent } from './job-worker-transaction.component';

describe('JobWorkerTransactionComponent', () => {
  let component: JobWorkerTransactionComponent;
  let fixture: ComponentFixture<JobWorkerTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobWorkerTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobWorkerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
