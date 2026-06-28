import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopBar } from './components/top-bar/top-bar';
import { BottomBar } from './components/bottom-bar/bottom-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TopBar, BottomBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
