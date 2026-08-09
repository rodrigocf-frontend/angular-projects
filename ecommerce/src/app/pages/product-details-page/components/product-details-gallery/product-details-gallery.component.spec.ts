import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsGalleryComponent } from './product-details-gallery.component';
import { ProductImage } from '../../../../shared/models/product.model';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';

const THREE_IMAGES: ProductImage[] = [
  ...MOCK_PRODUCT.images,
  { id: 'img-3', url: 'https://example.com/img-3.jpg', alt: 'Detalhe' },
];

describe('ProductDetailsGalleryComponent', () => {
  let component: ProductDetailsGalleryComponent;
  let fixture: ComponentFixture<ProductDetailsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsGalleryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsGalleryComponent);
    component = fixture.componentInstance;
  });

  const setImages = async (images: ProductImage[]) => {
    fixture.componentRef.setInput('images', images);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await setImages(THREE_IMAGES);
    expect(component).toBeTruthy();
  });

  it('should set currentBg to the first image and reset index when images arrive', async () => {
    await setImages(THREE_IMAGES);
    expect(component.currentBg()).toEqual(THREE_IMAGES[0]);
    expect(component.indexImage()).toBe(0);
  });

  it('should render a thumbnail per image and mark the active one', async () => {
    await setImages(THREE_IMAGES);
    const compiled = fixture.nativeElement as HTMLElement;
    const thumbs = compiled.querySelectorAll('.thumb');
    expect(thumbs.length).toBe(3);
    expect(thumbs[0].classList.contains('active')).toBe(true);
    expect(thumbs[1].classList.contains('active')).toBe(false);
  });

  it('should render navigation arrows only when there is more than one image', async () => {
    await setImages(THREE_IMAGES);
    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.img-nav')).toBeTruthy();

    await setImages([THREE_IMAGES[0]]);
    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.img-nav')).toBeFalsy();
  });

  it('onNextImage should advance to the next image', async () => {
    await setImages(THREE_IMAGES);
    component.onNextImage();
    expect(component.indexImage()).toBe(1);
    expect(component.currentBg()).toEqual(THREE_IMAGES[1]);
  });

  it('onNextImage should wrap around to the first image after the last one', async () => {
    await setImages(THREE_IMAGES);
    component.onNextImage();
    component.onNextImage();
    component.onNextImage();
    expect(component.indexImage()).toBe(0);
    expect(component.currentBg()).toEqual(THREE_IMAGES[0]);
  });

  it('onPreviousImage should go to the previous image', async () => {
    await setImages(THREE_IMAGES);
    component.onNextImage();
    component.onNextImage();
    component.onPreviousImage();
    expect(component.indexImage()).toBe(1);
    expect(component.currentBg()).toEqual(THREE_IMAGES[1]);
  });

  it('onPreviousImage should wrap around to the last image when at the first one', async () => {
    await setImages(THREE_IMAGES);
    component.onPreviousImage();
    expect(component.indexImage()).toBe(2);
    expect(component.currentBg()).toEqual(THREE_IMAGES[2]);
  });

  it('should call onNextImage/onPreviousImage when nav buttons are clicked', async () => {
    await setImages(THREE_IMAGES);
    const nextSpy = vi.spyOn(component, 'onNextImage');
    const prevSpy = vi.spyOn(component, 'onPreviousImage');

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('.img-nav button');
    buttons[0].click();
    buttons[1].click();

    expect(prevSpy).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });
});
