import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignStockReportsComponent } from './design-stock-reports.component';

describe('DesignStockReportsComponent', () => {
  let component: DesignStockReportsComponent;
  let fixture: ComponentFixture<DesignStockReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignStockReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignStockReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
