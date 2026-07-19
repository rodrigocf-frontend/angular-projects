import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Marquee } from './components/marquee/marquee';
import { Categories } from './components/categories/categories';

@Component({
  selector: 'app-home',
  imports: [Hero, Marquee, Categories],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home {}
