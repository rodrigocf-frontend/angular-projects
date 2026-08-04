import { Attribute, Component, signal } from '@angular/core';

@Component({
  selector: 'button[primary], button[ghost], button[secondary]',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class.btn-primary]': 'isPrimary()',
    '[class.btn-ghost]': 'isGhost()',
    '[class.btn-secondary]': 'isSecondary()',
  },
})
export class ButtonComponent {
  isPrimary = signal<boolean>(false);
  isSecondary = signal<boolean>(false);
  isGhost = signal<boolean>(false);

  constructor(
    @Attribute('primary') primary: boolean,
    @Attribute('ghost') ghost: boolean,
    @Attribute('secondary') secondary: boolean,
  ) {
    if (primary !== null) {
      this.isPrimary.set(true);
      return;
    }

    if (secondary !== null) {
      this.isSecondary.set(true);
      return;
    }

    if (ghost !== null) {
      this.isGhost.set(true);
      return;
    }
  }
}
