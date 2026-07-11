import { Component } from '@angular/core';
import { ComingSoon } from '../../shared/components/coming-soon/coming-soon';
import { TopBar } from '../../shared/components/top-bar/top-bar';

@Component({
  selector: 'app-calendar',
  imports: [TopBar, ComingSoon],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {}
