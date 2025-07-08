import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContractorComponent } from './list-contractor.component';

describe('ListContractorComponent', () => {
  let component: ListContractorComponent;
  let fixture: ComponentFixture<ListContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
