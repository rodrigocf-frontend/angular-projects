import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantyControlComponent } from './quanty-control.component';

describe('QuantyControlComponent', () => {
  let component: QuantyControlComponent;
  let fixture: ComponentFixture<QuantyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantyControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantyControlComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
