import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DrawerCartComponent } from './shared/components/drawer-cart/drawer-cart.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, DrawerCartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
