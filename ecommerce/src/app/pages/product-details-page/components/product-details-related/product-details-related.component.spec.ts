import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsRelatedComponent } from './product-details-related.component';

describe('ProductDetailsRelatedComponent', () => {
  let component: ProductDetailsRelatedComponent;
  let fixture: ComponentFixture<ProductDetailsRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsRelatedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsRelatedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
