import { Component } from '@angular/core';
import { BoardTable } from '../../components/board-table/board-table';

@Component({
  selector: 'app-board',
  imports: [BoardTable],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {}
