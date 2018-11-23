import { Component, OnInit } from '@angular/core';
import {ChessBoardComponent} from './chess-board/chess-board.component';

interface IGameInfo {
  board: ChessBoardComponent;
  currentFen: string;
  currentPgn: string;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  games: IGameInfo[] = [];
  pazzlePgn: string;

  constructor() { }  

  ngOnInit(): void {
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

  onBoardStatusChanged(game: IGameInfo, board: ChessBoardComponent) {
    if (!game.board) {
      game.board = board;
    }
    game.status = this.getGameStatus(board.engine);
    game.currentFen = board.engine.fen();
    game.currentPgn = board.engine.pgn();
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
