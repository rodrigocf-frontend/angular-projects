import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';

import ProductDetailsPageComponent from './product-details-page.component';
import {
  selectDetailsPageLoading,
  selectProduct,
  selectRelatedProducts,
} from './store/product-details.selectors';
import { loadProduct } from './store/product-details.actions';
import { MOCK_PRODUCT } from '../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../mocks/models/products.mock';
import { ProductDetailsInfoComponent } from './components/product-details-info/product-details-info.component';

@Component({ template: '' })
class DummyRouteComponent {}

describe('ProductDetailsPageComponent', () => {
  let component: ProductDetailsPageComponent;
  let fixture: ComponentFixture<ProductDetailsPageComponent>;
  let store: MockStore;
  let paramMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    paramMap$ = new BehaviorSubject(convertToParamMap({ id: MOCK_PRODUCT.id }));

    await TestBed.configureTestingModule({
      imports: [ProductDetailsPageComponent],
      providers: [
        provideRouter([{ path: '**', component: DummyRouteComponent }]),
        provideMockStore(),
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$ } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectDetailsPageLoading, false);
    store.overrideSelector(selectProduct, MOCK_PRODUCT);
    store.overrideSelector(selectRelatedProducts, []);
  });

  const createComponent = async () => {
    fixture = TestBed.createComponent(ProductDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create and dispatch loadProduct with the id from the route', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    await createComponent();

    expect(component).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(loadProduct({ id: MOCK_PRODUCT.id }));
  });

  it('should not dispatch loadProduct when the route has no id', async () => {
    paramMap$.next(convertToParamMap({}));
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    await createComponent();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should re-dispatch loadProduct when the route id changes', async () => {
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    paramMap$.next(convertToParamMap({ id: 'other-id' }));
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(loadProduct({ id: 'other-id' }));
  });

  it('should render the skeleton while isLoadingPage$ is true', async () => {
    store.overrideSelector(selectDetailsPageLoading, true);
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-product-details-skeleton')).toBeTruthy();
    expect(compiled.querySelector('app-product-details-not-found')).toBeFalsy();
    expect(compiled.querySelector('app-product-details-gallery')).toBeFalsy();
  });

  it('should render the not-found component when loading is done and there is no product', async () => {
    store.overrideSelector(selectDetailsPageLoading, false);
    store.overrideSelector(selectProduct, null);
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-product-details-not-found')).toBeTruthy();
    expect(compiled.querySelector('app-product-details-skeleton')).toBeFalsy();
    expect(compiled.querySelector('app-product-details-gallery')).toBeFalsy();
  });

  it('should render the product view (breadcrumb, gallery, info) when loaded successfully', async () => {
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-breadcrumb')).toBeTruthy();
    expect(compiled.querySelector('app-product-details-gallery')).toBeTruthy();
    expect(compiled.querySelector('app-product-details-info')).toBeTruthy();
    expect(compiled.querySelector('app-product-details-skeleton')).toBeFalsy();
    expect(compiled.querySelector('app-product-details-not-found')).toBeFalsy();
  });

  it('should render app-product-details-related with no cards when there are no related products', async () => {
    store.overrideSelector(selectRelatedProducts, []);
    await createComponent();
    const compiled = fixture.nativeElement as HTMLElement;
    // the @if(...; as relatedProducts) block still renders for an empty array (arrays are truthy)
    expect(compiled.querySelector('app-product-details-related')).toBeTruthy();
    expect(compiled.querySelectorAll('.rel-card').length).toBe(0);
  });

  it('should render one related card per emitted related product', async () => {
    store.overrideSelector(selectRelatedProducts, ALL_PRODUCTS_MOCK.slice(0, 4));
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-product-details-related')).toBeTruthy();
    expect(compiled.querySelectorAll('.rel-card').length).toBe(4);
  });

  it('should reset the info component state when a related product card fires onClickCardReset', async () => {
    store.overrideSelector(selectRelatedProducts, ALL_PRODUCTS_MOCK.slice(0, 2));
    await createComponent();

    const infoDebugElement = fixture.debugElement.query(
      (de) => de.componentInstance instanceof ProductDetailsInfoComponent,
    );
    const infoComponent = infoDebugElement.componentInstance as ProductDetailsInfoComponent;
    const resetSpy = vi.spyOn(infoComponent, 'resetState');

    // change tab away from the default so we know something actually needs resetting
    infoComponent.onClickTab(infoComponent.tabs[1].index);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(infoComponent.tabIndex()).toBe(infoComponent.tabs[1].index);

    const compiled = fixture.nativeElement as HTMLElement;
    const relatedLink = compiled.querySelector<HTMLAnchorElement>('app-product-details-related a');
    relatedLink?.click();
    await fixture.whenStable();

    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(infoComponent.tabIndex()).toBe(0);
  });
});
