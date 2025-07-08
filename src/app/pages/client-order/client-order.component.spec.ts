import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrderComponent } from './client-order.component';

describe('ClientOrderComponent', () => {
  let component: ClientOrderComponent;
  let fixture: ComponentFixture<ClientOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
