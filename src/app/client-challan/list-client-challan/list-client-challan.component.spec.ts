import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientChallanComponent } from './list-client-challan.component';

describe('ListClientChallanComponent', () => {
  let component: ListClientChallanComponent;
  let fixture: ComponentFixture<ListClientChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClientChallanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClientChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
