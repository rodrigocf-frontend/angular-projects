import { booleanAttribute, Component, computed, input } from '@angular/core';

@Component({
  selector: 'button[primary], button[ghost], button[danger]',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.btn-primary]': 'primary()',
    '[class.btn-ghost]': 'ghost()',
    '[class.btn-danger]': 'danger()',
    '[class.base]': 'isBase()',
    '[class.sm]': 'isSm()',
  },
})
export class Button {
  primary = input(false, { transform: booleanAttribute });
  ghost = input(false, { transform: booleanAttribute });
  danger = input(false, { transform: booleanAttribute });
  size = input<'base' | 'sm'>('base');

  isBase = computed(() => this.size() === 'base');
  isSm = computed(() => this.size() === 'sm');
}
