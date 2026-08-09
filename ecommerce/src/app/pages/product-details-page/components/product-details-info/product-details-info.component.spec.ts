import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ProductDetailsInfoComponent } from './product-details-info.component';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';
import { Product } from '../../../../shared/models/product.model';
import { addProductInCart } from '../../../product-cart-page/store/product-cart.actions';
import { getProductColors, getProductsSizes } from '../../../../shared/utils/product';

describe('ProductDetailsInfoComponent', () => {
  let component: ProductDetailsInfoComponent;
  let fixture: ComponentFixture<ProductDetailsInfoComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsInfoComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  const setData = async (data: Product) => {
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await setData(MOCK_PRODUCT);
    expect(component).toBeTruthy();
  });

  it('should split the product name into title + last-word emphasis', async () => {
    await setData(MOCK_PRODUCT);
    // "Jaqueta Oversized Denim Vintage" -> title "Jaqueta Oversized Denim", emphasis "Vintage"
    expect(component.nameParts()).toEqual({
      title: 'Jaqueta Oversized Denim',
      emphasis: 'Vintage',
    });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-name em')?.textContent).toBe('Vintage');
  });

  it('should default to the first color and first size', async () => {
    await setData(MOCK_PRODUCT);
    const colors = getProductColors(MOCK_PRODUCT);
    const sizes = getProductsSizes(MOCK_PRODUCT);
    expect(component.selectedColor()).toEqual(colors[0]);
    expect(component.selectedSize()).toEqual(sizes[0]);
  });

  it('should render the sale price and discount badge when the product is on sale', async () => {
    await setData(MOCK_PRODUCT);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.price-old')).toBeTruthy();
    expect(compiled.querySelector('.price-badge')?.textContent).toContain(
      `${MOCK_PRODUCT.discount}%`,
    );
  });

  it('should not render the old price or badge when the product is not on sale', async () => {
    const regularProduct: Product = { ...MOCK_PRODUCT, isSale: false };
    await setData(regularProduct);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.price-old')).toBeFalsy();
    expect(compiled.querySelector('.price-badge')).toBeFalsy();
  });

  it('onClickColor should update the selected color', async () => {
    await setData(MOCK_PRODUCT);
    const colors = getProductColors(MOCK_PRODUCT);
    component.onClickColor(1);
    expect(component.selectedColor()).toEqual(colors[1]);
  });

  it('onClickSize should update the selected size', async () => {
    await setData(MOCK_PRODUCT);
    const sizes = getProductsSizes(MOCK_PRODUCT);
    component.onClickSize(1);
    expect(component.selectedSize()).toEqual(sizes[1]);
  });

  it('clicking a color/size option in the template should call onClickColor/onClickSize', async () => {
    await setData(MOCK_PRODUCT);
    const compiled = fixture.nativeElement as HTMLElement;
    const colorOptions = compiled.querySelectorAll<HTMLElement>('.color-opt');
    colorOptions[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.selectedColor()).toEqual(getProductColors(MOCK_PRODUCT)[1]);

    const sizeOptions = compiled.querySelectorAll<HTMLElement>('.size-opt');
    sizeOptions[2].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.selectedSize()).toEqual(getProductsSizes(MOCK_PRODUCT)[2]);
  });

  it('should render stars based on the rounded rating', async () => {
    await setData(MOCK_PRODUCT);
    // rating 4.8 rounds to 5
    expect(component.renderStars(MOCK_PRODUCT.rating)).toBe('★★★★★');
    expect(component.renderStars(2.4)).toBe('★★☆☆☆');
  });

  it('addOnCart should dispatch addProductInCart with the product id, selected color and size', async () => {
    await setData(MOCK_PRODUCT);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onClickColor(1);
    component.onClickSize(1);

    component.addOnCart();

    expect(dispatchSpy).toHaveBeenCalledWith(
      addProductInCart({
        id: MOCK_PRODUCT.id,
        color: getProductColors(MOCK_PRODUCT)[1],
        size: getProductsSizes(MOCK_PRODUCT)[1],
      }),
    );
  });

  it('should dispatch addProductInCart when the "Adicionar à sacola" button is clicked', async () => {
    await setData(MOCK_PRODUCT);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const addButton = compiled.querySelector<HTMLButtonElement>('button[primary]');
    addButton?.click();

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should switch tabs when a tab button is clicked and mark it active', async () => {
    await setData(MOCK_PRODUCT);
    const compiled = fixture.nativeElement as HTMLElement;
    const tabButtons = compiled.querySelectorAll<HTMLButtonElement>('.tab-btn');
    expect(tabButtons.length).toBe(3);

    tabButtons[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.tabIndex()).toBe(1);
    expect(tabButtons[1].classList.contains('active')).toBe(true);
    expect(document.getElementById('composicao')?.classList.contains('active')).toBe(true);
    expect(document.getElementById('descricao')?.classList.contains('active')).toBe(false);
  });

  it('should render composition and care instruction lists in their respective tab panels', async () => {
    await setData(MOCK_PRODUCT);
    const compiled = fixture.nativeElement as HTMLElement;
    const compositionItems = compiled.querySelectorAll('#composicao li');
    const careItems = compiled.querySelectorAll('#cuidados li');
    expect(compositionItems.length).toBe(MOCK_PRODUCT.composition.length);
    expect(careItems.length).toBe(MOCK_PRODUCT.careInstructions.length);
  });

  it('resetState should reset tab, size and color indexes to 0', async () => {
    await setData(MOCK_PRODUCT);
    component.onClickColor(1);
    component.onClickSize(1);
    component.onClickTab(component.tabs[2].index);

    component.resetState();

    expect(component.tabIndex()).toBe(0);
    expect(component.selectedColor()).toEqual(getProductColors(MOCK_PRODUCT)[0]);
    expect(component.selectedSize()).toEqual(getProductsSizes(MOCK_PRODUCT)[0]);
  });
});
