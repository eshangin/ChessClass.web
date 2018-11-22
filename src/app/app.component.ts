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
      pieceTheme: '/images/chesspieces/{piece}.png',
      position: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'
    };

    const board = ChessBoard('board', boardConfig);
  }
}
