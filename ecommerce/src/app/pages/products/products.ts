import { Component } from '@angular/core';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-products',
  imports: [Breadcrumb, Sidebar],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export default class Products {}
