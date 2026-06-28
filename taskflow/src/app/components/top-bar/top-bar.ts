import { Component } from '@angular/core';
import { Button } from '../ui/button/button';
import { Icon } from '../ui/icon/icon';
import { Avatar } from '../ui/avatar/avatar';

@Component({
  selector: 'app-top-bar',
  imports: [Button, Icon, Avatar],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {}
