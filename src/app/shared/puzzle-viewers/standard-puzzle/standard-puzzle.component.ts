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
    turn: 'white' | 'black',
    allChecks: ChessJS.Move[];
  };
  private engine: ChessInstance = new Chess();

  constructor(private chessHelperService: ChessHelperService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pgn) {
      this.updatePgn();
    }
  }

  private updatePgn() {
    this.puzzleInfo = this.chessHelperService.parsePuzzle(this.pgn);
    let fen = this.puzzleInfo.initialFen;

    this.initialFenInfo = {
      dests: this.chessHelperService.getChessgroundPossibleDests(fen),
      turn: new Chess(fen).turn() == 'w' ? 'white' : 'black',
      allChecks: this.chessHelperService.findAllChecks(fen)
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

  private onMove(orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) {
    let move = (this.engine.moves({verbose:true}) as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
    this.engine.move(move);
    this.pieceMoved.emit({move: move, moveType: MoveType.NormalOnDrop});

    if (this.isCorrectPuzzleMove(this.puzzleInfo, this.engine)) {
      console.log('Correct move!!!');      

      if (this.puzzleInfo.solutionMovements.length == this.engine.history().length) {
        console.log('Done!!!');
        this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.PuzzleDone, move: move});
      } else {
        this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.CorrectMove, move: move});
        let programmaticMove = this.makeSolutionMove();
        this.pieceMoved.emit({move: programmaticMove, moveType: MoveType.NormalProgrammatic});
      }
    } else {
      let undoMove = this.engine.undo();
      this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.IncorrectMove, move: undoMove});
      setTimeout(() => {
        this.pieceMoved.emit({move: undoMove, moveType: MoveType.Undo});
        let fen = this.engine.fen();
        let turn: cgTypes.Color = this.engine.turn() == 'w' ? 'white' : 'black';
        // undo move
        this.cgApi.set({
          fen: fen,
          turnColor: turn,
          movable: {
            color: turn,
            dests: this.chessHelperService.getChessgroundPossibleDests(fen)
          },
          draggable: {enabled: true}
        });
      }, 1000);
    }
  }

  makeSolutionMove(): ChessJS.Move {
    if (this.engine.history().length % 2 == 1) {
      const movesMadeCount = this.engine.history().length;
      let move = this.puzzleInfo.solutionMovements[movesMadeCount];
      this.cgApi.move(move.from as cgTypes.Key, move.to as cgTypes.Key);
      this.engine.move(move);
      return move;
    }

    return null;
  }

  onBoardInit(cgApi: Api) {
    this.cgApi = cgApi;
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
