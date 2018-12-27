import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Config } from 'chessground/config';
import * as Chess from 'chess.js';
import * as _ from 'underscore'
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import * as cgTypes from 'chessground/types';
import { PuzzleSolutionStateType } from 'src/app/services/puzzle-workflow/puzzle-workflow.service';
import { PuzzleComponent, IMoveInfo } from '../puzzle-component';

@Component({
  selector: 'app-find-all-checks-puzzle',
  templateUrl: './find-all-checks-puzzle.component.html',
  styleUrls: ['./find-all-checks-puzzle.component.scss']
})
export class FindAllChecksPuzzleComponent extends PuzzleComponent implements OnChanges {

  @Input() fen: string;
  boardConfig: Config;
  private foundChecks: string[];
  private allChecks: ChessJS.Move[];

  constructor(
    protected chessHelperService: ChessHelperService
  ) {
    super(chessHelperService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fen) {
      this.initFindChecksPuzzle();
    }
  }

  private initFindChecksPuzzle() {
    this.allChecks = this.chessHelperService.findAllChecks(this.fen);
    this.foundChecks = [];
    this.init(this.fen);
  }

  convertMove(orig: cgTypes.Key, dest: cgTypes.Key): ChessJS.Move {
    return (new Chess(this.fen).moves({verbose:true}) as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
  }

  handlePuzzleSolutionState(move: ChessJS.Move, state: PuzzleSolutionStateType) {
    this.moveMade.emit({ stateType: state, move: move } as IMoveInfo);
    this.disableBoardUserMoves();
    setTimeout(() => {
      // move to initial pozition
      this.updateBoardUiInfo(this.fen, this.initialFenInfo.turn)
    }, 1000);
  }

  getPuzzleSolutionState(move: ChessJS.Move): PuzzleSolutionStateType {
    let e = new Chess(this.fen);
    e.move(move);
    const isCheck = e.in_check();
    if (isCheck && this.foundChecks.indexOf(move.san) == -1) {
      this.foundChecks.push(move.san);
    }
    let status = isCheck 
                  ? this.foundChecks.length == this.allChecks.length
                      ? PuzzleSolutionStateType.PuzzleDone
                      : PuzzleSolutionStateType.CorrectMove
                  : PuzzleSolutionStateType.IncorrectMove;
    return status;
  }
}
