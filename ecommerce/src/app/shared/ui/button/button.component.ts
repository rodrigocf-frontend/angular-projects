import { Attribute, Component, signal } from '@angular/core';

@Component({
  selector:
    'button[primary], button[ghost], button[secondary], button[underline] ,a[primary], a[ghost]',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class.btn-primary]': 'isPrimary()',
    '[class.btn-ghost]': 'isGhost()',
    '[class.btn-secondary]': 'isSecondary()',
    '[class.btn-underline]': 'isUnderline()',
  },
})
export class ButtonComponent {
  isPrimary = signal<boolean>(false);
  isSecondary = signal<boolean>(false);
  isGhost = signal<boolean>(false);
  isUnderline = signal<boolean>(false);

  constructor(
    @Attribute('primary') primary: boolean,
    @Attribute('ghost') ghost: boolean,
    @Attribute('secondary') secondary: boolean,
    @Attribute('underline') underline: boolean,
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
    if (underline !== null) {
      this.isUnderline.set(true);
      return;
    }
  }
}
