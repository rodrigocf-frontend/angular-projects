import { Component } from '@angular/core';
import { Button } from '../../components/ui/button/button';
import { Avatar } from '../../components/ui/avatar/avatar';
import { Icon } from '../../components/ui/icon/icon';

@Component({
  selector: 'app-board',
  imports: [Button, Avatar, Icon],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {}
