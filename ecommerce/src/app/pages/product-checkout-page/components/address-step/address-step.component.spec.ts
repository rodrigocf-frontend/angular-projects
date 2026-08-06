import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressStepComponent } from './address-step.component';

describe('AddressStepComponent', () => {
  let component: AddressStepComponent;
  let fixture: ComponentFixture<AddressStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressStepComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
