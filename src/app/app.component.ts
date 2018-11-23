import { Component, OnInit } from '@angular/core';

interface IGameInfo {
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

  constructor() { }  

  ngOnInit(): void {
    this.games.push({} as IGameInfo);
    this.games.push({} as IGameInfo);
  }

  onBoardStatusChanged(game: IGameInfo, engine: ChessInstance) {
    game.status = this.getGameStatus(engine);
    game.currentFen = engine.fen();
    game.currentPgn = engine.pgn();
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
