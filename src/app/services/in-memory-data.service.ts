import { InMemoryDbService, RequestInfoUtilities, ParsedRequestUrl } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const puzzles = this.getPuzzles();

    const pupils = [
      { id: 'a', name: 'Иван З', homeworks: [{id: 1, puzzles: [ puzzles[0], puzzles[1] ] }] },
      { id: 'b', name: 'Сергей Б' },
      { id: 'c', name: 'Анна К' },
      { id: 'd', name: 'Игорь П' },
      { id: 'e', name: 'Сергей Н' }
    ];

    const classes = [
      { id: '1', name: 'Класс 1' },
      { id: '2', name: 'Класс 2' }
    ];

    return {
      classes,
      pupils,
      puzzles,
      class1pupils: pupils.slice(0, 3),
      class2pupils: pupils.slice(3)
    };
  }

  // parseRequestUrl override
  // Do this to manipulate the request URL or the parsed result
  // into something your data store can handle.
  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {

    const pattern = /\/classes\/(\w+)\/pupils/;

    if (RegExp(pattern).test(url)) {
      const newUrl = url.replace(pattern, '/class$1pupils');
      const parsed = utils.parseRequestUrl(newUrl);
  
      if (parsed) {
        console.log(`parseRequestUrl override of '${url}':`, parsed);
      }
  
      return parsed;
    }
  }
  
  private getPuzzles() {
    return [
      {
        id: 'a',
        pgn: `
[Round "-"]
[White "9 AUTHORS"]
[Black "#2"]
[Result "1-0"]
[FEN "8/8/8/8/1Q6/1K6/8/2Nk4 w - - 0 1"]
[SetUp "1"]

1. Qa5 Kxc1 2. Qe1# 1-0`.trim() 
      },
      {
        id: 'b',
        pgn: `
[Event "Illustrated London News"]
[Site "?"]
[Date "1849.??.??"]
[Round "-"]
[White "A. B. S."]
[Black "#2"]
[Result "1-0"]
[FEN "8/8/5R2/8/2P1k3/2K5/5P2/2B5 w - - 0 1"]
[SetUp "1"]

1. Bb2 Ke5 2. Kd3# 1-0`.trim()
      },
      {
        id: 'c',
        pgn: `
[Event "Probleemblad"]
[Site "?"]
[Date "1983.??.??"]
[Round "-"]
[White "AARZEN Hans"]
[Black "#2"]
[Result "1-0"]
[FEN "2R3N1/3prn2/NP2qp2/3k1B2/R4PPQ/BnP2P2/bK2p3/8 w - - 0 1"]
[SetUp "1"]

1. Qxf6 Bb1 2. c4# 1-0`.trim()
      }
    ];
  }
}
