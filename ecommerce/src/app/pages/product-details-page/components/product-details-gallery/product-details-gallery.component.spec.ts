import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsGalleryComponent } from './product-details-gallery.component';

describe('ProductDetailsGalleryComponent', () => {
  let component: ProductDetailsGalleryComponent;
  let fixture: ComponentFixture<ProductDetailsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsGalleryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsGalleryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
