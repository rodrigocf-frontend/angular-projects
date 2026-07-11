import { Component } from '@angular/core';
import { ComingSoon } from '../../shared/components/coming-soon/coming-soon';
import { TopBar } from '../../shared/components/top-bar/top-bar';

@Component({
  selector: 'app-reports',
  imports: [ComingSoon, TopBar],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {}
