import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {ChessPuzzle, ChessHelperService} from 'src/app/services/chess-helper.service';
import { ChessBoardComponent, MoveInfo, MoveType } from '../../chess-board/chess-board.component';
import { Api } from 'chessground/api';
import * as cgTypes from 'chessground/types';
import { Config } from 'chessground/config';
import * as Chess from 'chess.js';

export enum PuzzleSolutionStateType {
  CorrectMove = 1,
  PuzzleDone,
  IncorrectMove
}

@Component({
  selector: 'app-standard-puzzle',
  templateUrl: './standard-puzzle.component.html',
  styleUrls: ['./standard-puzzle.component.scss']
})
export class StandardPuzzleComponent implements OnChanges {

  boardConfig: Config;
  @Input() pgn: string;
  @Output() private puzzleSolutionStateChanged = new EventEmitter<{stateType: PuzzleSolutionStateType, move: ChessJS.Move}>();
  @Output() private pieceMoved = new EventEmitter<MoveInfo>();
  private puzzleInfo: ChessPuzzle;
  private cgApi: Api;
  private initialFenInfo: {
    dests: {
      [key: string]: cgTypes.Key[];
    },
    turn: 'white' | 'black'
  };
  private engine: ChessInstance = new Chess();

  constructor(private chessHelperService: ChessHelperService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pgn) {
      this.init();
    }
  }

  private init() {
    this.puzzleInfo = this.chessHelperService.parsePuzzle(this.pgn);
    let fen = this.puzzleInfo.initialFen;

    this.initialFenInfo = {
      dests: this.chessHelperService.getChessgroundPossibleDests(fen),
      turn: new Chess(fen).turn() == 'w' ? 'white' : 'black'
    };
    this.boardConfig = { 
      fen: fen,
      turnColor: this.initialFenInfo.turn,
      movable: {
        dests: this.initialFenInfo.dests,
        color: this.initialFenInfo.turn,
        free: false,
        showDests: false,
        events: {
          after: (orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) => 
            this.onMove(orig, dest, metadata)
        }
      },
      draggable: {
        enabled: true
      },
      selectable: {
        enabled: false
      },
      lastMove: null
    };
    this.engine.load(fen);
  }

  onBoardInit(cgApi: Api) {
    this.cgApi = cgApi;
  }

  private onMove(orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) {
    let move = (this.engine.moves({verbose:true}) as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
    this.pieceMoved.emit({move: move, moveType: MoveType.NormalOnDrop});

    let state = this.getPuzzleSolutionState(move);
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
          this.updateBoardUiInfo(this.engine.fen(), this.engine.turn() == 'w' ? 'white' : 'black');
        }, 500);
        break;
      case PuzzleSolutionStateType.IncorrectMove:
        this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.IncorrectMove, move: move});
        this.disableBoardUserMoves();
        setTimeout(() => {
          // undo move
          let undoMove = this.engine.undo();
          this.pieceMoved.emit({move: undoMove, moveType: MoveType.Undo});
          this.updateBoardUiInfo(this.engine.fen(), this.engine.turn() == 'w' ? 'white' : 'black');
        }, 1000);
        break;
    }
  }

  private getNextPuzzleMove(): ChessJS.Move {
    const movesMadeCount = this.engine.history().length;
    return this.puzzleInfo.solutionMovements[movesMadeCount];
  }

  private getPuzzleSolutionState(move: ChessJS.Move): PuzzleSolutionStateType {
    this.engine.move(move);
    if (this.isCorrectPuzzleMove(this.puzzleInfo, this.engine)) {
      return (this.puzzleInfo.solutionMovements.length == this.engine.history().length)
        ? PuzzleSolutionStateType.PuzzleDone
        : PuzzleSolutionStateType.CorrectMove;
    }

    return PuzzleSolutionStateType.IncorrectMove;
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

  private disableBoardUserMoves() {
    this.cgApi.set({
      draggable: {enabled: false}
    });
  }

  private updateBoardUiInfo(fen: string, turn: 'white' | 'black') {
    this.cgApi.cancelMove();
    this.cgApi.set({
      fen: fen,
      turnColor: turn,
      movable: {
        color: turn,
        dests: this.chessHelperService.getChessgroundPossibleDests(fen)
      },
      draggable: {enabled: true}
    });
  }
}
