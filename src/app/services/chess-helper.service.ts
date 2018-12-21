import { Injectable } from '@angular/core';
import * as Chess from 'chess.js';

export interface ChessPuzzle {
  initialFen: string;
  solutionMovements: string[];
  turn: ChessJS.Types.ChessColor;
}

@Injectable({
  providedIn: 'root'
})
export class ChessHelperService {

  constructor() { }

  parsePuzzle(pgn: string): ChessPuzzle {
    let engine = new Chess();
    engine.load_pgn(pgn);
    let puzzle = {
      solutionMovements: engine.history()
    } as ChessPuzzle;

    // Assume that max possible movements is 200. 200 should be enought.
    const maxMovementsCount = 200;
    for (let i = 0; i <= maxMovementsCount; i++) {
      if (engine.undo() == null) {
        // Means we found initial puzle positoin
        break;
      }

      if (i == maxMovementsCount) {
        throw new Error('something wrong, cannot parse puzzle from pgn');        
      }
    }

    puzzle.initialFen = engine.fen();
    puzzle.turn = engine.turn();

    return puzzle;
  }

  tryFixFen(fen: string, defaultColor: 'w' | 'b' = 'w'): string {
    let fenSplit = fen.split(' ');
    if (fenSplit.length >= 1 && fenSplit.length <= 5) {
      return fen + ' ' + [defaultColor,'KQkq','-','0','1'].slice(fenSplit.length - 1).join(' ');
    }
    return fen;
  }

  getChessgroundPossibleDests(engine: ChessInstance) {
    let dests = {};
    (engine.moves({verbose: true}) as Array<ChessJS.Move>).forEach(m => {
      if (!dests[m.from]) {
        dests[m.from] = [];
      }
      dests[m.from].push(m.to);
    });
    return dests;
  }
}
