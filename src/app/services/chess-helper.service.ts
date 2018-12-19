import { Injectable } from '@angular/core';
import _ from 'underscore'
import * as Chess from 'chess.js';

export interface ChessPuzzle {
  initialFen: string;
  solutionMovements: string[];
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

    return puzzle;
  }

  tryFixFen(fen: string, defaultColor: 'w' | 'b' = 'w'): string {
    let fenSplit = fen.split(' ');
    if (fenSplit.length >= 1 && fenSplit.length <= 5) {
      return fen + ' ' + [defaultColor,'-','-','0','1'].slice(fenSplit.length - 1).join(' ');
    }
    return fen;
  }

  getChessgroundPossibleDests(engine: ChessInstance) {
    let dests = {};
    _(engine.moves({verbose: true}))
     .chain()
     .groupBy('from')
     .map((items, key) => {
       return {
         from: key,
         moves: _(items).pluck('to')
       };
     })
     .each(el => {
       dests[el.from] = el.moves;
     });
     return dests;
  }
}
