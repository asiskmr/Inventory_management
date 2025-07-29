import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorStockReportsComponent } from './contractor-stock-reports.component';

describe('ContractorStockReportsComponent', () => {
  let component: ContractorStockReportsComponent;
  let fixture: ComponentFixture<ContractorStockReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorStockReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorStockReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
