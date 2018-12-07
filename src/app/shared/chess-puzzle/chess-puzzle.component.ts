import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {ChessBoardComponent, MoveInfo, MoveType} from '../chess-board/chess-board.component';
import {ChessPuzzle, ChessHelperService} from 'src/app/services/chess-helper.service';

@Component({
  selector: 'app-chess-puzzle',
  templateUrl: './chess-puzzle.component.html',
  styleUrls: ['./chess-puzzle.component.scss']
})
export class ChessPuzzleComponent implements OnChanges {

  @Input() pgn: string;
  @Input() showBoardNotation: boolean = true;
  puzzleInitialFen: string;
  private puzzleInfo: ChessPuzzle;
  private board: ChessBoardComponent;

  constructor(private chessHelperService: ChessHelperService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pgn) {
      this.updatePgn();
    }
  }

  private updatePgn() {
    this.puzzleInfo = this.chessHelperService.parsePuzzle(this.pgn);
    this.puzzleInitialFen = this.puzzleInfo.initialFen;
  }

  onPieceMoved(moveInfo: MoveInfo) {
    if (moveInfo.moveType == MoveType.NormalOnDrop) {
      if (this.isCorrectPuzzleMove(this.puzzleInfo, this.board.engine)) {
        console.log('Correct move!!!');

        //this.tryMovePieceIfOnlyOnePossibleMove(board);

        if (this.puzzleInfo.solutionMovements.length == this.board.engine.history().length) {
          console.log('Done!!!');
        } else {
          this.makeSolutionMove();
        }
      } else {
        this.board.undoMove();
        //this.tryMovePieceIfOnlyOnePossibleMove(board);
      }
    }
  }

  makeSolutionMove() {
    if (this.board.engine.history().length % 2 == 1) {
      const movesMadeCount = this.board.engine.history().length;
      let move = this.puzzleInfo.solutionMovements[movesMadeCount];
      this.board.movePiece(move);
    }
  }

  onBoardStatusChanged(board: ChessBoardComponent) {
    this.board = board;
  }

  private tryMovePieceIfOnlyOnePossibleMove(board: ChessBoardComponent) {
    if (board.engine.history().length % 2 == 1) {
      const possibleMoves = board.engine.moves();
      if (possibleMoves.length == 1) {
        board.movePiece(possibleMoves[0]);
      }
    }
  }

  private isCorrectPuzzleMove(puzzle: ChessPuzzle, engine: ChessInstance): boolean {
    const movesMadeCount = engine.history().length;

    return movesMadeCount == 0
      ? false
      : this.arraysEqual(puzzle.solutionMovements.slice(0, movesMadeCount), engine.history());
  }

  private arraysEqual(arr1: Array<any>, arr2: Array<any>): boolean {
    return arr1.length == arr2.length && !arr1.some((val, idx) => arr2[idx] !== val);
  }
}
