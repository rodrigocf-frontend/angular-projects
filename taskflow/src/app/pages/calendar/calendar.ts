import { Component } from '@angular/core';
import { ComingSoon } from '../../shared/components/coming-soon/coming-soon';

@Component({
  selector: 'app-calendar',
  imports: [ComingSoon],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {}
