import { Component, effect, input, signal } from '@angular/core';
import { ProductImage } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-details-gallery',
  imports: [],
  templateUrl: './product-details-gallery.component.html',
  styleUrl: './product-details-gallery.component.scss',
})
export class ProductDetailsGalleryComponent {
  images = input.required<ProductImage[]>();
  currentBg = signal<ProductImage | null>(null);
  indexImage = signal<number>(0);

  constructor() {
    effect(() => {
      const currentImages = this.images();
      if (currentImages.length > 0) {
        this.currentBg.set(this.images()[0]);
      }
    });
  }

  onNextImage() {
    const index = this.indexImage();
    if (index + 1 < this.images().length) {
      this.currentBg.set(this.images()[index + 1]);
      this.indexImage.update((prevState) => prevState + 1);
    } else {
      this.currentBg.set(this.images()[0]);
      this.indexImage.set(0);
    }
  }

  onPreviousImage() {
    const index = this.indexImage();
    const maxIndexes = this.images().length - 1;
    if (index === 0) {
      this.currentBg.set(this.images()[maxIndexes]);
      this.indexImage.set(maxIndexes);
    } else {
      this.currentBg.set(this.images()[this.indexImage() - 1]);
      this.indexImage.update((prevState) => prevState - 1);
    }
  }
}
