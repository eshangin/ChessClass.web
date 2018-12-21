import { Component, OnInit, Input } from '@angular/core';
import { Config } from 'chessground/config';
import * as Chess from 'chess.js';
import * as _ from 'underscore'

@Component({
  selector: 'app-find-all-checks-puzzle',
  templateUrl: './find-all-checks-puzzle.component.html',
  styleUrls: ['./find-all-checks-puzzle.component.scss']
})
export class FindAllChecksPuzzleComponent implements OnInit {

  @Input() fen: string;
  boardConfig: Config;

  constructor() { }

  ngOnInit() {
    this.boardConfig = { 
      fen: this.fen
    };

    let checkMoves = this.findAllChecks(this.fen);
    console.log('check moves', checkMoves);
    this.viewNextCheck(this.fen, checkMoves);
  }

  private findAllChecks(fen: string): string[] {
    let checkMoves = [];
    let engine = new Chess(fen);
    (engine.moves() as string[]).forEach(m => {
      engine.move(m);
      if (engine.in_check()) {
        checkMoves.push(m);
      }
      engine.undo();
    });
    return checkMoves;
  }

  private viewNextCheck(initialFen: string, moves: string[]) {
    let checkMove = moves.pop();
    if (checkMove) {
      setTimeout(() => {
        console.log(checkMove);
        let engine = new Chess(initialFen);
        engine.move(checkMove);
        this.boardConfig = _.extend({}, this.boardConfig, {fen: engine.fen()});
        setTimeout(() => {
          this.boardConfig = _.extend({}, this.boardConfig, {fen: initialFen});
          this.viewNextCheck(initialFen, moves);
        }, 1000);          
      }, 2000);
    }
  }

}
