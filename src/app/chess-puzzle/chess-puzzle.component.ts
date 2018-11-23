import { Component, OnInit, Input } from '@angular/core';
import {ChessHelperService, ChessPuzzle} from '../chess-helper.service';
import {ChessBoardComponent} from '../chess-board/chess-board.component';

@Component({
  selector: 'app-chess-puzzle',
  templateUrl: './chess-puzzle.component.html',
  styleUrls: ['./chess-puzzle.component.scss']
})
export class ChessPuzzleComponent implements OnInit {

  @Input() pgn: string;
  puzzleInitialFen: string;
  private puzzleInfo: ChessPuzzle;

  constructor(private chessHelperService: ChessHelperService) { }

  ngOnInit() {
    this.puzzleInfo = this.chessHelperService.parsePuzzle(this.pgn);
    this.puzzleInitialFen = this.puzzleInfo.initialFen;
  }

  onPieceMoved(board: ChessBoardComponent) {
    if (this.isCorrectPuzzleMove(this.puzzleInfo, board.engine)) {
      console.log('Correct move!!!');
      if (board.engine.history().length % 2 == 1) {
        console.log('try move piece');
        this.movePieceIfOnlyOnePossibleMove(board);
      }

      if (this.puzzleInfo.solutionMovements.length == board.engine.history().length) {
        console.log('Done!!!');
      }
    }
  }

  private movePieceIfOnlyOnePossibleMove(board: ChessBoardComponent) {
    const possibleMoves = board.engine.moves();
    if (possibleMoves.length == 1) {
      board.movePiece(possibleMoves[0]);
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
