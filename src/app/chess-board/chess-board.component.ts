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
  @Output() private pieceMoved = new EventEmitter<ChessBoardComponent>();
  @Output() private boardInitiated = new EventEmitter<ChessBoardComponent>();
  engine: ChessInstance;
  private board: ChessBoardInstance;

  constructor(private elementRef: ElementRef) {
  }  

  ngOnInit() {
    if (this.fen) {
      this.engine = new Chess();

      const boardConfig: ChessBoardJS.BoardConfig = {
        draggable: true,
        pieceTheme: '/images/chesspieces/{piece}.png',
        onDragStart: (source, piece) => this.onDragStart(piece),
        onDrop: (source, target) => this.onDrop(source, target),
        onSnapEnd: () => this.onSnapEndFunc()
      };

      this.board = ChessBoard(this.elementRef.nativeElement, boardConfig);
      
      this.setFen(this.fen);

      this.boardInitiated.emit(this);
    }
  }

  undoMove() {
    this.engine.undo();
    this.board.position(this.engine.fen());
  }

  undoAllMoves() {
    this.setFen(this.fen);
  }

  canUndo(): boolean {
    return this.engine.history().length != 0;
  }

  private setFen(fen: string) {
    this.engine.load(fen);
    this.board.position(fen);
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

    this.pieceMoved.emit(this);
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
