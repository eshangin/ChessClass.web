import { Component, OnInit } from '@angular/core';

import * as ChessBoard from 'chessboardjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  board: ChessBoardInstance;
  title = 'Hi!';

  ngOnInit(): void {
    const boardConfig: ChessBoardJS.BoardConfig = {
      draggable: true,
      pieceTheme: 'https://s3-us-west-2.amazonaws.com/chessimg/{piece}.png',
      position: 'start'
    };

    const board = ChessBoard('board', boardConfig);
  }
}
