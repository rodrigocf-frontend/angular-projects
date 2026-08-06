import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-quanty-control',
  imports: [],
  templateUrl: './quanty-control.component.html',
  styleUrl: './quanty-control.component.scss',
})
export class QuantyControlComponent {
  onAdd = output();
  onRemove = output();
  value = input.required<number>();
}
