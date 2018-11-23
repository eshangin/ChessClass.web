import { Component, OnInit, Input } from '@angular/core';

import * as Chess from 'chess.js';
import {ChessBoardComponent} from '../chess-board/chess-board.component';

@Component({
  selector: 'game-controls',
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.scss']
})
export class GameControlsComponent implements OnInit {

  @Input() board: ChessBoardComponent;

  constructor() { }

  ngOnInit() {
  }

  undoAllMoves() {
    this.board.undoAllMoves();
  }

  undoMove() {
    this.board.undoMove();
  }

  canUndo(): boolean {
    return this.board.canUndo();
  }
}
