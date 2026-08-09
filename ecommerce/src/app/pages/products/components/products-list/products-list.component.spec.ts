import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductsListComponent } from './products-list.component';
import { Product } from '../../../../shared/models/product.model';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../../../mocks/models/products.mock';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
  });

  const setData = async (data: Product[]) => {
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await setData([]);
    expect(component).toBeTruthy();
  });

  it('should render the empty-list component when there are no products', async () => {
    await setData([]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-list')).toBeTruthy();
    expect(compiled.querySelector('.products-grid')?.classList.contains('empty-grid')).toBe(true);
  });

  it('should render a product card for each product', async () => {
    const products = ALL_PRODUCTS_MOCK.slice(0, 3);
    await setData(products);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.product-card').length).toBe(3);
    expect(compiled.querySelector('app-empty-list')).toBeFalsy();
    expect(compiled.querySelector('.products-grid')?.classList.contains('empty-grid')).toBe(false);
  });

  it('should render brand, name and formatted price', async () => {
    await setData([MOCK_PRODUCT]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-brand')?.textContent).toContain(MOCK_PRODUCT.brand);
    expect(compiled.querySelector('.product-name')?.textContent).toContain(MOCK_PRODUCT.name);
    expect(compiled.querySelector('.price-current')?.textContent).toContain('299,90');
  });

  it('should render the "Novo" and sale badges when applicable', async () => {
    await setData([MOCK_PRODUCT]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.badge-new')?.textContent).toContain('Novo');
    expect(compiled.querySelector('.badge-sale')?.textContent).toContain(
      `−${MOCK_PRODUCT.discount}%`,
    );
  });

  it('should not render badges for a product that is neither new nor on sale', async () => {
    const plainProduct: Product = { ...MOCK_PRODUCT, isNew: false, isSale: false };
    await setData([plainProduct]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.badge-new')).toBeFalsy();
    expect(compiled.querySelector('.badge-sale')).toBeFalsy();
  });

  it('should render a size tag for each parsed size and a dot for each parsed color', async () => {
    await setData([MOCK_PRODUCT]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.size-tag').length).toBe(
      component.getSizes(MOCK_PRODUCT).length,
    );
    expect(compiled.querySelectorAll('.dot').length).toBe(component.getColors(MOCK_PRODUCT).length);
  });

  it('should build a router link to the product details page', async () => {
    await setData([MOCK_PRODUCT]);
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.getAttribute('href')).toBe(`/product/details/${MOCK_PRODUCT.id}`);
  });
});
