import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientChallanComponent } from './create-client-challan.component';

describe('CreateClientChallanComponent', () => {
  let component: CreateClientChallanComponent;
  let fixture: ComponentFixture<CreateClientChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClientChallanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClientChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
