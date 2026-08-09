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
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the expected placeholder counts', () => {
    expect(component.items.length).toBe(4);
    expect(component.colors.length).toBe(3);
    expect(component.sizes.length).toBe(5);
    expect(component.perks.length).toBe(3);
  });

  it('should render the corresponding number of skeleton placeholders for each section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.skeleton-thumb').length).toBe(4);
    expect(compiled.querySelectorAll('.skeleton-color-dot').length).toBe(3);
    expect(compiled.querySelectorAll('.skeleton-size').length).toBe(5);
    expect(compiled.querySelectorAll('.skeleton-perk').length).toBe(3);
  });

  it('should render the gallery and info skeleton sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skeleton-gallery')).toBeTruthy();
    expect(compiled.querySelector('.skeleton-info')).toBeTruthy();
    expect(compiled.querySelector('.skeleton-main-img')).toBeTruthy();
  });
});
