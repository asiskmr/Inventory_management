import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContractorChallanComponent } from './create-contractor-challan.component';

describe('CreateContractorChallanComponent', () => {
  let component: CreateContractorChallanComponent;
  let fixture: ComponentFixture<CreateContractorChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContractorChallanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateContractorChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
