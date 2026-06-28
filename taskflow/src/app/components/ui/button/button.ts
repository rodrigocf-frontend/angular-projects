import { Attribute, Component } from '@angular/core';

@Component({
  selector: 'button[primary], button[ghost]',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.btn-primary]': 'isPrimary',
    '[class.btn-ghost]': 'isGhost',
  },
})
export class Button {
  isPrimary = false;
  isGhost = false;

  constructor(
    @Attribute('primary') primary: boolean | null,
    @Attribute('ghost') ghost: boolean | null,
  ) {
    this.isPrimary = primary !== null;
    this.isGhost = ghost !== null;
  }
}
