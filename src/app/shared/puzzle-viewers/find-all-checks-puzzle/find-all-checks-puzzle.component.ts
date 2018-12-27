import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Config } from 'chessground/config';
import * as Chess from 'chess.js';
import * as _ from 'underscore'
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import * as cgTypes from 'chessground/types';
import { Api } from 'chessground/api';
import { PuzzleSolutionStateType } from '../standard-puzzle/standard-puzzle.component';

export interface IMoveInfo {
  stateType: PuzzleSolutionStateType,
  move: ChessJS.Move
}

export interface IInitializedInfo {
  fen: string;
  allChecks: ChessJS.Move[];
}

@Component({
  selector: 'app-find-all-checks-puzzle',
  templateUrl: './find-all-checks-puzzle.component.html',
  styleUrls: ['./find-all-checks-puzzle.component.scss']
})
export class FindAllChecksPuzzleComponent implements OnChanges {

  @Input() fen: string;
  boardConfig: Config;
  @Output() moveMade = new EventEmitter<IMoveInfo>();
  @Output() initialized = new EventEmitter<IInitializedInfo>();
  @Output() boardInit = new EventEmitter<Api>();
  private cgApi: Api;
  private initialFenInfo: {
    dests: {
      [key: string]: cgTypes.Key[];
    },
    turn: 'white' | 'black',
    allChecks: ChessJS.Move[];
  };
  private foundChecks: string[];

  constructor(
    private chessHelperService: ChessHelperService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fen) {
      this.init();
    }
  }

  private init() {
    this.foundChecks = [];
    this.initialFenInfo = {
      dests: this.chessHelperService.getChessgroundPossibleDests(this.fen),
      turn: new Chess(this.fen).turn() == 'w' ? 'white' : 'black',
      allChecks: this.chessHelperService.findAllChecks(this.fen)
    };
    this.boardConfig = { 
      fen: this.fen,
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
    this.initialized.emit({ fen: this.fen, allChecks: this.initialFenInfo.allChecks });
  }

  onBoardInit(cgApi: Api) {
    this.cgApi = cgApi;
    this.boardInit.emit(cgApi);
  }

  private onMove(orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) {
    let move = (new Chess(this.fen).moves({verbose:true}) as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
    let state = this.getPuzzleSolutionState(move, orig, dest);
    this.moveMade.emit({ stateType: state, move: move } as IMoveInfo);
    this.disableBoardUserMoves();
    setTimeout(() => {
      // move to initial pozition
      this.updateBoardUiInfo(this.fen, this.initialFenInfo.turn)
    }, 1000);
  }

  private getPuzzleSolutionState(move: ChessJS.Move, orig: cgTypes.Key, dest: cgTypes.Key): PuzzleSolutionStateType {
    const isCheck = this.initialFenInfo.allChecks.some(m => {
      return m.from == orig && m.to == dest;
    });
    if (isCheck && this.foundChecks.indexOf(move.san) == -1) {
      this.foundChecks.push(move.san);
    }
    let status = isCheck 
                  ? this.foundChecks.length == this.initialFenInfo.allChecks.length
                      ? PuzzleSolutionStateType.PuzzleDone
                      : PuzzleSolutionStateType.CorrectMove
                  : PuzzleSolutionStateType.IncorrectMove;
    return status;
  }

  private disableBoardUserMoves() {
    this.cgApi.set({
      draggable: {enabled: false}
    });
  }

  private updateBoardUiInfo(fen: string, turn: 'white' | 'black') {
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
