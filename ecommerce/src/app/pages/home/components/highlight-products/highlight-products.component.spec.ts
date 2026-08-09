import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HighlightProductsComponent } from './highlight-products.component';
import { Pagination } from '../../../../core/services/product/products.service';
import { Product } from '../../../../shared/models/product.model';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';

function buildPagination(data: Product[]): Pagination<Product> {
  return {
    first: 1,
    prev: 0,
    next: 0,
    last: 1,
    pages: 1,
    items: data.length,
    data,
  };
}

@Component({ template: '' })
class DummyRouteComponent {}

describe('HighlightProductsComponent', () => {
  let fixture: ComponentFixture<HighlightProductsComponent>;
  let component: HighlightProductsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightProductsComponent],
      providers: [provideRouter([{ path: '**', component: DummyRouteComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(HighlightProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.componentRef.setInput('data', buildPagination([MOCK_PRODUCT]));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should render the section header', async () => {
    fixture.componentRef.setInput('data', buildPagination([MOCK_PRODUCT]));
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-section-header')).toBeTruthy();
  });

  it('should render a product card per item with brand, name and price', async () => {
    fixture.componentRef.setInput('data', buildPagination([MOCK_PRODUCT]));
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.product-card');
    expect(cards.length).toBe(1);
    expect(compiled.querySelector('.product-brand')?.textContent).toContain(MOCK_PRODUCT.brand);
    expect(compiled.querySelector('.product-name')?.textContent).toContain(MOCK_PRODUCT.name);
    expect(compiled.querySelector('.price-current')).toBeTruthy();
  });

  it('should link each product card to its details page', async () => {
    fixture.componentRef.setInput('data', buildPagination([MOCK_PRODUCT]));
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    // .querySelector('a') would match app-section-header's own link first; scope to a product card.
    const link = compiled.querySelector('.hightlight-products-grid a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe(`/product/details/${MOCK_PRODUCT.id}`);
  });

  it('should render the "Novo" badge only for new products', async () => {
    const newProduct: Product = { ...MOCK_PRODUCT, id: 'p-new', isNew: true };
    const oldProduct: Product = { ...MOCK_PRODUCT, id: 'p-old', isNew: false };
    fixture.componentRef.setInput('data', buildPagination([newProduct, oldProduct]));
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.badge-new').length).toBe(1);
  });

  it('should render a color dot for each parsed product color', async () => {
    fixture.componentRef.setInput('data', buildPagination([MOCK_PRODUCT]));
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    // MOCK_PRODUCT has 2 colors encoded in its `colors` field
    expect(compiled.querySelectorAll('.product-colors .dot').length).toBe(2);
  });

  it('should render no product cards when the data list is empty', async () => {
    fixture.componentRef.setInput('data', buildPagination([]));
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.product-card').length).toBe(0);
  });

  it('should call scrollTo when a product card is clicked', async () => {
    fixture.componentRef.setInput('data', buildPagination([MOCK_PRODUCT]));
    const scrollSpy = vi.spyOn(component, 'scrollTo').mockImplementation(() => {});
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.hightlight-products-grid a') as HTMLAnchorElement).click();
    expect(scrollSpy).toHaveBeenCalledTimes(1);
  });
});
