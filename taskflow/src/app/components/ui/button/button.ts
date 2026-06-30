import { Attribute, Component } from '@angular/core';

@Component({
  selector: 'button[primary], button[ghost], button[danger]',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.btn-primary]': 'isPrimary',
    '[class.btn-ghost]': 'isGhost',
    '[class.btn-danger]': 'isDanger',
  },
})
export class Button {
  isPrimary = false;
  isGhost = false;
  isDanger = false;

  constructor(
    @Attribute('primary') primary: boolean | null,
    @Attribute('ghost') ghost: boolean | null,
    @Attribute('danger') danger: boolean | null,
  ) {
    this.isPrimary = primary !== null;
    this.isGhost = ghost !== null;
    this.isDanger = danger !== null;
  }
}
