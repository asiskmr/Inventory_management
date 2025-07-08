import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContractorComponent } from './create-contractor.component';

describe('CreateContractorComponent', () => {
  let component: CreateContractorComponent;
  let fixture: ComponentFixture<CreateContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
