import { Component, OnInit } from '@angular/core';
import {ChessBoardComponent} from 'src/app/shared/chess-board/chess-board.component';
import { MoveInfo } from 'src/app/shared/puzzle-viewers/puzzle-viewer-component';

interface IGameInfo {
  board: ChessBoardComponent;
  currentFen: string;
  currentPgn: string;
  status: string;
}

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss']
})
export class ExperimentsComponent implements OnInit {

  games: IGameInfo[] = [];
  pazzlePgn: string;  

  constructor() { }

  ngOnInit() {
    this.games.push({} as IGameInfo);
    this.games.push({} as IGameInfo);

    this.pazzlePgn = `
[Round "-"]
[White "9 AUTHORS"]
[Black "#2"]
[Result "1-0"]
[FEN "8/8/8/8/1Q6/1K6/8/2Nk4 w - - 0 1"]
[SetUp "1"]

1. Qa5 Kxc1 2. Qe1# 1-0`.trim();      
  }

  boardInitiated(game: IGameInfo, board: ChessBoardComponent) {
    if (!game.board) {
      game.board = board;
    }
  }

  onBoardStatusChanged(game: IGameInfo, moveInfo: MoveInfo) {
    game.status = this.getGameStatus(game.board.engine);
    game.currentFen = game.board.engine.fen();
    game.currentPgn = game.board.engine.pgn();
  }

  private getGameStatus(engine: ChessInstance): string {
    var status = '';
  
    var moveColor = 'White';
    if (engine.turn() === 'b') {
      moveColor = 'Black';
    }
  
    // checkmate?
    if (engine.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
  
    // TODO :: I think we need in_threefold_repetition(), insufficient_material() checks instead (and maybe other checks?)
    // // draw?
    // else if (this.engine.in_draw() === true) {
    //   status = 'Game over, drawn position';
    // }
  
    // game still on
    else {
      status = moveColor + ' to move';
  
      // check?
      if (engine.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
      }
    }
  
    return status;
  };
}
