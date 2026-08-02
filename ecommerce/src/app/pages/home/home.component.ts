import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HighlightProductsComponent } from './components/highlight-products/highlight-products.component';
import { BannerComponent } from './components/banner/banner.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {}
