import { Component, output } from '@angular/core';

@Component({
  selector: 'app-list-error',
  imports: [],
  templateUrl: './list-error.component.html',
  styleUrl: './list-error.component.scss',
})
export class ListErrorComponent {
  retry = output();
}
