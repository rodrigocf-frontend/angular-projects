import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerCartComponent } from './drawer-cart.component';

describe('DrawerCartComponent', () => {
  let component: DrawerCartComponent;
  let fixture: ComponentFixture<DrawerCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerCartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerCartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
