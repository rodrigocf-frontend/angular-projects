import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {}
