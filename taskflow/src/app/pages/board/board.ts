import { Component } from '@angular/core';
import { Button } from '../../components/ui/button/button';
import { Avatar } from '../../components/ui/avatar/avatar';

@Component({
  selector: 'app-board',
  imports: [Button, Avatar],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {}
