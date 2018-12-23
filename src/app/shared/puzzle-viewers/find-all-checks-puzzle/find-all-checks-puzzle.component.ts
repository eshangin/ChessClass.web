import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Config } from 'chessground/config';
import * as Chess from 'chess.js';
import * as _ from 'underscore'
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import * as cgTypes from 'chessground/types';
import { Api } from 'chessground/api';

export interface IMoveInfo {
  isCheck: boolean,
  move: ChessJS.Move
}

export interface IInitializedInfo {
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

  constructor(
    private chessHelperService: ChessHelperService
  ) { }

  ngOnInit() {
    this.initialFenInfo = {
      dests: this.chessHelperService.getChessgroundPossibleDests(this.fen),
      turn: new Chess(this.fen).turn() == 'w' ? 'white' : 'black',
      allChecks: this.findAllChecks(this.fen)
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
    this.initialized.emit({ allChecks: this.initialFenInfo.allChecks });

    //this.viewNextCheck();
  }

  onBoardInit(cgApi: Api) {
    this.cgApi = cgApi;
  }

  private onMove(orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) {
    let move = (new Chess(this.fen).moves() as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
    const isCheck = this.initialFenInfo.allChecks.some(m => {
      return m.from == orig && m.to == dest;
    });
    this.moveMade.emit({ isCheck: isCheck, move: move } as IMoveInfo);
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

  private findAllChecks(fen: string): ChessJS.Move[] {
    let checkMoves = [];
    let engine = new Chess(fen);
    (engine.moves({verbose: true}) as ChessJS.Move[]).forEach(m => {
      engine.move(m);
      if (engine.in_check()) {
        checkMoves.push(m);
      }
      engine.undo();
    });
    return checkMoves;
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
