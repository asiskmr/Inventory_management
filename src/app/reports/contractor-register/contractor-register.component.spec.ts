import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorRegisterComponent } from './contractor-register.component';

describe('ContractorRegisterComponent', () => {
  let component: ContractorRegisterComponent;
  let fixture: ComponentFixture<ContractorRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
