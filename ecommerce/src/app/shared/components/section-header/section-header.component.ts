import { Component, input } from '@angular/core';
import { RouterLink, UrlTree } from '@angular/router';

@Component({
  selector: 'app-section-header',
  imports: [RouterLink],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly emphasys = input.required<string>();
  readonly link = input.required<string | readonly any[] | UrlTree | null | undefined>();
}
