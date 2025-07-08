import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDesignComponent } from './create-design.component';

describe('CreateDesignComponent', () => {
  let component: CreateDesignComponent;
  let fixture: ComponentFixture<CreateDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDesignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
