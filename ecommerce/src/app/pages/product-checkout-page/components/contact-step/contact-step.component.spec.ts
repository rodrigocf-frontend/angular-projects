import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactStepComponent } from './contact-step.component';

describe('ContactStepComponent', () => {
  let component: ContactStepComponent;
  let fixture: ComponentFixture<ContactStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactStepComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
