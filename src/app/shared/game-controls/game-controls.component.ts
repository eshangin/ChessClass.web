import { Component, OnInit, Input } from '@angular/core';

import {ChessBoardComponent} from '../chess-board/chess-board.component';

@Component({
  selector: 'app-game-controls',
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
