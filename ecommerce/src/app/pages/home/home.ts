import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Marquee } from './components/marquee/marquee';
import { Categories } from './components/categories/categories';
import { HighlightProducts } from './components/highlight-products/highlight-products';
import { Banner } from './components/banner/banner';

@Component({
  selector: 'app-home',
  imports: [Hero, Marquee, Categories, HighlightProducts, Banner],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home {}
