import { Component, Input, ElementRef, Output, EventEmitter, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';

import * as ChessBoard from 'chessboardjs';
import * as Chess from 'chess.js';
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import { MoveInfo, MoveType } from 'src/app/services/puzzle-workflow/puzzle-workflow.service';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements AfterViewInit, OnChanges {

  @Input() fen: string;
  @Output() fenChange = new EventEmitter<string>();
  @Input() showNotation: boolean = true;
  @Input() editBoardMode: boolean = false;
  @Output() private pieceMoved = new EventEmitter<MoveInfo>();
  @Output() private boardInitiated = new EventEmitter<ChessBoardComponent>();
  engine: ChessInstance = new Chess();
  private board: ChessBoardInstance;

  constructor(
    private elementRef: ElementRef,
    private chessHelperService: ChessHelperService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fen) {
      this.updateFen();
    }
  }
  
  private updateFen() {
    this.fen = this.chessHelperService.tryFixFen(this.fen);

    this.engine.load(this.fen);

    const boardConfig: ChessBoardJS.BoardConfig = {
      draggable: true,
      pieceTheme: './assets/images/chesspieces/{piece}.png',
      onDragStart: (source, piece) => this.onDragStart(piece),
      onDrop: (source, target) => this.onDrop(source, target),
      onSnapEnd: () => this.onSnapEndFunc(),
      showNotation: this.showNotation,
      sparePieces: this.editBoardMode,
      dropOffBoard: 'trash'
    };

    if (!this.board) {
      this.board = ChessBoard(this.elementRef.nativeElement, boardConfig);
    }
    this.board.position(this.engine.fen(), false);

    this.boardInitiated.emit(this);    
  }

  ngAfterViewInit() {
    if (this.fen) {
      this.board.resize();
    }
  }

  undoMove() {
    let move = this.engine.undo();
    this.board.position(this.engine.fen());
    this.pieceMoved.emit({ move: move, moveType: MoveType.Undo });
  }

  undoAllMoves() {
    this.engine.load(this.fen);
    this.board.position(this.fen);
    this.pieceMoved.emit({ move: null, moveType: MoveType.Undo });
  }

  canUndo(): boolean {
    return this.engine.history().length != 0;
  }

  movePiece(move: string | ChessJS.Move) {
    let moveMade = this.engine.move(move);
    this.board.move(move.toString());
    this.pieceMoved.emit({ move: moveMade, moveType: MoveType.NormalProgrammatic });
  }

  private onDrop(source: string, target: string): string {
    const tryMove: ChessJS.Move = {
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    };
    const move = this.engine.move(tryMove);

    if (!this.editBoardMode && move == null) {
        return 'snapback';
    }

    this.pieceMoved.emit({ move: move, moveType: MoveType.NormalOnDrop });
  };

  private onSnapEndFunc() {
    if (!this.editBoardMode) {
      this.board.position(this.engine.fen());
    }

    this.fen = this.board.fen();
    this.fenChange.emit(this.fen);
  }

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  private onDragStart(piece: string): boolean {
    return (
      this.editBoardMode ||
        (!this.engine.game_over() &&
        this.allowMove(this.engine.turn(), piece))
    );
  };

  private allowMove(turn: string, piece: string): boolean {
    return !(
        ((String(turn).toLowerCase() === 'w') && (piece.search(/^b/) !== -1)) ||
        ((String(turn).toLowerCase() === 'b') && (piece.search(/^w/) !== -1))
    );
  }
  
}
