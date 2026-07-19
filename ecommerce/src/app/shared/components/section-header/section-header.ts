import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-section-header',
  imports: [NgTemplateOutlet],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss',
})
export class SectionHeader {
  readonly title = input.required<TemplateRef<any>>();
  link = input.required<string>();
}
