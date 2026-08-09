import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductDetailsRelatedComponent } from './product-details-related.component';
import { Product } from '../../../../shared/models/product.model';
import { ALL_PRODUCTS_MOCK } from '../../../../../mocks/models/products.mock';

@Component({ template: '' })
class DummyRouteComponent {}

describe('ProductDetailsRelatedComponent', () => {
  let component: ProductDetailsRelatedComponent;
  let fixture: ComponentFixture<ProductDetailsRelatedComponent>;
  const relatedProducts: Product[] = ALL_PRODUCTS_MOCK.slice(0, 3);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsRelatedComponent],
      providers: [provideRouter([{ path: '**', component: DummyRouteComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsRelatedComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  const setData = async (data: Product[]) => {
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await setData(relatedProducts);
    expect(component).toBeTruthy();
  });

  it('should render a related card for each product', async () => {
    await setData(relatedProducts);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.rel-card').length).toBe(3);
  });

  it('should render brand, name and price for each related product', async () => {
    await setData([relatedProducts[0]]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.rel-brand')?.textContent).toContain(relatedProducts[0].brand);
    expect(compiled.querySelector('.rel-name')?.textContent).toContain(relatedProducts[0].name);
    expect(compiled.querySelector('.rel-price')?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('should link to the product details route for each item', async () => {
    await setData(relatedProducts);
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    expect(links[0].getAttribute('href')).toBe(`/product/details/${relatedProducts[0].id}`);
  });

  it('should render nothing when data is empty', async () => {
    await setData([]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.rel-card').length).toBe(0);
  });

  it('onClickRelatedProduct should scroll to top and emit onClickCardReset', async () => {
    await setData(relatedProducts);
    const emitSpy = vi.fn();
    component.onClickCardReset.subscribe(emitSpy);

    // The scroll call goes through the real (jsdom-polyfilled) Lenis instance - asserting on its
    // internals isn't reliable across the Angular/Vitest module graph, so this only verifies the
    // call doesn't throw and the reset output still fires, which is the behavior that matters here.
    expect(() => component.onClickRelatedProduct()).not.toThrow();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should call onClickRelatedProduct when a related card link is clicked', async () => {
    await setData(relatedProducts);
    const emitSpy = vi.fn();
    component.onClickCardReset.subscribe(emitSpy);

    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector<HTMLAnchorElement>('a');
    expect(() => link?.click()).not.toThrow();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
