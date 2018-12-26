import { Injectable } from '@angular/core';
import * as Chess from 'chess.js';
import * as cgTypes from 'chessground/types';

export interface ChessPuzzle {
  initialFen: string;
  solutionMovements: ChessJS.Move[];
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
      solutionMovements: engine.history({verbose:true})
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

  getChessgroundPossibleDests(fen: string): {
    [key: string]: cgTypes.Key[];
  } {
    let dests = {};
    let engine = new Chess(fen);
    (engine.moves({verbose: true}) as Array<ChessJS.Move>).forEach(m => {
      if (!dests[m.from]) {
        dests[m.from] = [];
      }
      dests[m.from].push(m.to);
    });
    return dests;
  }

  getTurn(fen: string): ChessJS.Types.ChessColor {
    return new Chess(fen).turn();
  }

  findAllChecks(fen: string): ChessJS.Move[] {
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
}
