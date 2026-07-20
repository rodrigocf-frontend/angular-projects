import { Component } from '@angular/core';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { Sidebar } from './components/sidebar/sidebar';
import { ProductsList } from './components/products-list/products-list';
import { Pagination } from './components/pagination/pagination';

@Component({
  selector: 'app-products',
  imports: [Breadcrumb, Sidebar, ProductsList, Pagination],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export default class Products {}
