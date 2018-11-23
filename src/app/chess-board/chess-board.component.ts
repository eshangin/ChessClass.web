import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

import * as ChessBoard from 'chessboardjs';
import * as Chess from 'chess.js';

@Component({
  selector: 'chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {

  @Input() fen: string;
  @Output() moved = new EventEmitter<ChessInstance>();
  private engine: ChessInstance;
  private board: ChessBoardInstance;

  constructor(private elementRef: ElementRef) {
    console.log(elementRef);    
  }  

  ngOnInit() {
    if (this.fen) {
      this.engine = new Chess();
      this.engine.load(this.fen);

      const boardConfig: ChessBoardJS.BoardConfig = {
        draggable: true,
        pieceTheme: '/images/chesspieces/{piece}.png',
        onDragStart: (source, piece) => this.onDragStart(piece),
        onDrop: (source, target) => this.onDrop(source, target),
        onSnapEnd: () => this.onSnapEndFunc()
      };

      this.board = ChessBoard(this.elementRef.nativeElement, boardConfig);
      this.board.position(this.engine.fen());
    }
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

    this.moved.emit(this.engine);
    //this.updateStatus();
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
}
