import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Config } from 'chessground/config';
import * as Chess from 'chess.js';
import * as _ from 'underscore'
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import * as cgTypes from 'chessground/types';
import { Api } from 'chessground/api';
import { PuzzleSolutionStateType } from '../chess-puzzle/chess-puzzle.component';

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
export class FindAllChecksPuzzleComponent implements OnInit {

  @Input() fen: string;
  boardConfig: Config;
  @Output() moveMade = new EventEmitter<IMoveInfo>();
  @Output() initialized = new EventEmitter<IInitializedInfo>();
  private cgApi: Api;
  private initialFenInfo: {
    dests: {
      [key: string]: cgTypes.Key[];
    },
    turn: 'white' | 'black',
    allChecks: ChessJS.Move[];
  };
  private foundChecks: string[] = [];

  constructor(
    private chessHelperService: ChessHelperService
  ) { }

  ngOnInit() {
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
      }
    };
    this.initialized.emit({ fen: this.fen, allChecks: this.initialFenInfo.allChecks });

    //this.viewNextCheck();
  }

  onBoardInit(cgApi: Api) {
    this.cgApi = cgApi;
  }

  private onMove(orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) {
    let move = (new Chess(this.fen).moves({verbose:true}) as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
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
    this.moveMade.emit({ stateType: status, move: move } as IMoveInfo);
    this.cgApi.set({
      draggable: {enabled: false}
    });
    setTimeout(() => {
      // move to initial pozition
      this.cgApi.set({
        fen: this.fen,
        turnColor: this.initialFenInfo.turn,
        movable: {
          color: this.initialFenInfo.turn,
          dests: this.chessHelperService.getChessgroundPossibleDests(this.fen)
        },
        draggable: {enabled: true}
      });
    }, 1000);
  }

  private viewNextCheck(moves?: ChessJS.Move[]) {
    if (!moves) {
      moves = this.initialFenInfo.allChecks;
    }
    let checkMove = moves.pop();
    if (checkMove) {
      setTimeout(() => {
        console.log(checkMove);
        let engine = new Chess(this.fen);
        engine.move(checkMove);
        this.boardConfig = _.extend({}, this.boardConfig, {fen: engine.fen()});
        setTimeout(() => {
          this.boardConfig = _.extend({}, this.boardConfig, {fen: this.fen});
          this.viewNextCheck(moves);
        }, 1000);          
      }, 1000);
    }
  }

}
