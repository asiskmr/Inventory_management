import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContractorChallanComponent } from './list-contractor-challan.component';

describe('ListContractorChallanComponent', () => {
  let component: ListContractorChallanComponent;
  let fixture: ComponentFixture<ListContractorChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListContractorChallanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListContractorChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
