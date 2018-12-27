import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {ChessPuzzle, ChessHelperService} from 'src/app/services/chess-helper.service';
import * as cgTypes from 'chessground/types';
import * as Chess from 'chess.js';
import { PuzzleViewerComponent, PuzzleSolutionStateType, MoveType } from '../puzzle-viewer-component';

@Component({
  selector: 'app-standard-puzzle',
  templateUrl: './standard-puzzle.component.html',
  styleUrls: ['./standard-puzzle.component.scss']
})
export class StandardPuzzleComponent extends PuzzleViewerComponent implements OnChanges {

  @Input() pgn: string;
  private puzzleInfo: ChessPuzzle;
  private engine: ChessInstance = new Chess();

  constructor(
    protected chessHelperService: ChessHelperService) {
      super(chessHelperService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pgn) {
      this.initStandardPuzzle();
    }
  }

  private initStandardPuzzle() {
    this.puzzleInfo = this.chessHelperService.parsePuzzle(this.pgn);
    let fen = this.puzzleInfo.initialFen;
    this.engine.load(fen);
    super.init(fen);
  }

  getPuzzleSolutionState(move: ChessJS.Move): PuzzleSolutionStateType {
    this.engine.move(move);
    if (this.isCorrectPuzzleMove(this.puzzleInfo, this.engine)) {
      return (this.puzzleInfo.solutionMovements.length == this.engine.history().length)
        ? PuzzleSolutionStateType.PuzzleDone
        : PuzzleSolutionStateType.CorrectMove;
    }

    return PuzzleSolutionStateType.IncorrectMove;
  }

  convertMove(orig: cgTypes.Key, dest: cgTypes.Key): ChessJS.Move {
    return (this.engine.moves({verbose:true}) as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
  }

  handlePuzzleSolutionState(move: ChessJS.Move, state: PuzzleSolutionStateType) {
    switch (state) {
      case PuzzleSolutionStateType.PuzzleDone:
        this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.PuzzleDone, move: move});
        break;
      case PuzzleSolutionStateType.CorrectMove:
        this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.CorrectMove, move: move});
        this.disableBoardUserMoves();
        setTimeout(() => {
          let programmaticMove = this.getNextPuzzleMove();
          this.cgApi.move(programmaticMove.from as cgTypes.Key, programmaticMove.to as cgTypes.Key);
          this.engine.move(programmaticMove);
          this.pieceMoved.emit({move: programmaticMove, moveType: MoveType.NormalProgrammatic});
          const fen = this.engine.fen();
          const dests = this.chessHelperService.getChessgroundPossibleDests(fen);
          this.makeBoardMove(programmaticMove.from as cgTypes.Key, programmaticMove.to as cgTypes.Key, 
            dests, this.engine.turn() == 'w' ? 'white' : 'black');
        }, 500);
        break;
      case PuzzleSolutionStateType.IncorrectMove:
        this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.IncorrectMove, move: move});
        this.disableBoardUserMoves();
        setTimeout(() => {
          // undo move
          let undoMove = this.engine.undo();
          this.pieceMoved.emit({move: undoMove, moveType: MoveType.Undo});
          const fen = this.engine.fen();
          const dests = this.chessHelperService.getChessgroundPossibleDests(fen);
          this.makeBoardMove(move.to as cgTypes.Key, move.from as cgTypes.Key, dests, this.engine.turn() == 'w' ? 'white' : 'black');
        }, 1000);
        break;
    }
  }

  private getNextPuzzleMove(): ChessJS.Move {
    const movesMadeCount = this.engine.history().length;
    return this.puzzleInfo.solutionMovements[movesMadeCount];
  }

  private isCorrectPuzzleMove(puzzle: ChessPuzzle, engine: ChessInstance): boolean {
    const movesMadeCount = engine.history().length;

    return movesMadeCount == 0
      ? false
      : this.arraysEqual(puzzle.solutionMovements.slice(0, movesMadeCount).map(m => m.san), engine.history());
  }

  private arraysEqual(arr1: Array<any>, arr2: Array<any>): boolean {
    return arr1.length == arr2.length && !arr1.some((val, idx) => arr2[idx] !== val);
  }
}
