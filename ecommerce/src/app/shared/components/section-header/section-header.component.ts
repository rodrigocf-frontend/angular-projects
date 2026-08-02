import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  imports: [],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly emphasys = input.required<string>();
  readonly link = input.required<string>();
}
