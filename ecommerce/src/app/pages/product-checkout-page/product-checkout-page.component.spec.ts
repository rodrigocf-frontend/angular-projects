import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCheckoutPageComponent } from './product-checkout-page.component';

describe('ProductCheckoutPageComponent', () => {
  let component: ProductCheckoutPageComponent;
  let fixture: ComponentFixture<ProductCheckoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCheckoutPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCheckoutPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
