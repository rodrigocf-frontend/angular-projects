import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsNotFoundComponent } from './product-details-not-found.component';

describe('ProductDetailsNotFoundComponent', () => {
  let component: ProductDetailsNotFoundComponent;
  let fixture: ComponentFixture<ProductDetailsNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsNotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsNotFoundComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
