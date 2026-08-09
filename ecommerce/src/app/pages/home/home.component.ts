import { Component, inject, OnInit } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HighlightProductsComponent } from './components/highlight-products/highlight-products.component';
import { BannerComponent } from './components/banner/banner.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Store } from '@ngrx/store';
import { ProductService } from '../../core/services/product/products.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    MarqueeComponent,
    CategoriesComponent,
    HighlightProductsComponent,
    BannerComponent,
    NewsletterComponent,
    FooterComponent,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  private readonly productService = inject(ProductService);

  productsCategories$ = this.productService.getFilters();
  productsFeatured$ = this.productService.getProducts({
    page: 1,
    sort: [
      {
        name: 'Featured',
        type: 'featured',
      },
    ],
    perPage: 4,
  });
}
