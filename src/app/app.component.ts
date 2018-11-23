import { Component, OnInit } from '@angular/core';

import * as ChessBoard from 'chessboardjs';
import * as Chess from 'chess.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private engine: ChessInstance;
  private board: ChessBoardInstance;
  //currentFen: string = 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19';
  currentFen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  currentPgn: string;
  gameStatus: string;

  constructor() {
    this.engine = new Chess();
  }  

  ngOnInit(): void {
    this.engine.load(this.currentFen);

    const boardConfig: ChessBoardJS.BoardConfig = {
      draggable: true,
      pieceTheme: '/images/chesspieces/{piece}.png',
      onDragStart: (source, piece) => this.onDragStart(piece),
      onDrop: (source, target) => this.onDrop(source, target),
      onSnapEnd: () => this.onSnapEndFunc()
    };

    this.board = ChessBoard('board', boardConfig);
    this.board.position(this.engine.fen());

    this.updateStatus();
  }

  private onDrop(source: string, target: string): string {
    const tryMove: ChessJS.Move = {
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    };
    const move = this.engine.move(tryMove);

    if (move == null) {
        return 'snapback';
    }

    this.updateStatus();
  };

  private onSnapEndFunc() {
    return this.board.position(this.engine.fen());
  }

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  private onDragStart(piece: string): boolean {
    return (
        !this.engine.game_over() &&
        this.allowMove(this.engine.turn(), piece)
    );
  };

  private allowMove(turn: string, piece: string): boolean {
    return !(
        ((String(turn).toLowerCase() === 'w') && (piece.search(/^b/) !== -1)) ||
        ((String(turn).toLowerCase() === 'b') && (piece.search(/^w/) !== -1))
    );
  }

  private updateStatus() {
    var status = '';
  
    var moveColor = 'White';
    if (this.engine.turn() === 'b') {
      moveColor = 'Black';
    }
  
    // checkmate?
    if (this.engine.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
  
    // TODO :: I think we need in_threefold_repetition(), insufficient_material() checks instead (and maybe other checks?)
    // // draw?
    // else if (this.engine.in_draw() === true) {
    //   status = 'Game over, drawn position';
    // }
  
    // game still on
    else {
      status = moveColor + ' to move';
  
      // check?
      if (this.engine.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
      }
    }
  
    this.gameStatus = status;
    this.currentFen = this.engine.fen();
    this.currentPgn = this.engine.pgn();
  };  
}
