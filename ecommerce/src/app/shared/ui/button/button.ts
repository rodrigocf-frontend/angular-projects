import { Attribute, Component, signal } from '@angular/core';

@Component({
  selector: 'button[primary], button[ghost]',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.btn-primary]': 'isPrimary()',
    '[class.btn-ghost]': 'isGhost()',
  },
})
export class Button {
  isPrimary = signal<boolean>(false);
  isGhost = signal<boolean>(false);

  constructor(@Attribute('primary') primary: boolean, @Attribute('ghost') ghost: boolean) {
    if (primary !== null) {
      this.isPrimary.set(true);
      return;
    }

    if (ghost !== null) {
      this.isGhost.set(true);
      return;
    }
  }
}
