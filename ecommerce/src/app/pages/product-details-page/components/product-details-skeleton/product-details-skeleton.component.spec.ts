import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsSkeletonComponent } from './product-details-skeleton.component';

describe('ProductDetailsSkeletonComponent', () => {
  let component: ProductDetailsSkeletonComponent;
  let fixture: ComponentFixture<ProductDetailsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsSkeletonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
