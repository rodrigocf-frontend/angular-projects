import { Component, computed, effect, input, signal } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { getProductColors, getProductsSizes, ProductColor } from '../../../../shared/utils/product';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

enum DetailsTabEnum {
  description,
  composition,
  care,
}

@Component({
  selector: 'app-product-details-info',
  imports: [CurrencyPipe, ButtonComponent],
  templateUrl: './product-details-info.component.html',
  styleUrl: './product-details-info.component.scss',
})
export class ProductDetailsInfoComponent {
  data = input.required<Product>();

  private readonly colorIndex = signal(0);
  selectedColor = computed(() => this.getColors(this.data())[this.colorIndex()]);

  private readonly sizeIndex = signal(0);
  selectedSize = computed(() => this.getSizes(this.data())[this.sizeIndex()]);

  readonly tabIndex = signal<DetailsTabEnum>(DetailsTabEnum.description);
  protected DetailsTabEnum = DetailsTabEnum;

  tabs: {
    label: string;
    index: DetailsTabEnum;
  }[] = [
    { label: 'Descrição', index: DetailsTabEnum.description },
    { label: 'Composição', index: DetailsTabEnum.composition },
    { label: 'Cuidados', index: DetailsTabEnum.care },
  ];

  readonly nameParts = computed(() => {
    const words = this.data().name.trim().split(/\s+/);
    const emphasis = words.pop() ?? '';
    return { title: words.join(' '), emphasis };
  });

  renderStars(rating: number, maxStars = 5) {
    const roundedRating = Math.round(rating);
    const fullStars = '★'.repeat(roundedRating);
    const emptyStars = '☆'.repeat(maxStars - roundedRating);

    return fullStars + emptyStars;
  }

  onClickColor(index: number) {
    this.colorIndex.set(index);
  }

  onClickSize(index: number) {
    this.sizeIndex.set(index);
  }

  onClickTab(tab: DetailsTabEnum) {
    return this.tabIndex.set(tab);
  }

  getColors = getProductColors;

  getSizes = getProductsSizes;
}
