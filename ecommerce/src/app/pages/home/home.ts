import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Marquee } from './components/marquee/marquee';

@Component({
  selector: 'app-home',
  imports: [Hero, Marquee],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home {}
