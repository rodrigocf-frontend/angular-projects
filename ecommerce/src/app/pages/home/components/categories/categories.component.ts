import { Component, input } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { FiltersApiResponse } from '../../../../core/services/product/products.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [SectionHeaderComponent, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  data = input.required<FiltersApiResponse>();
}
