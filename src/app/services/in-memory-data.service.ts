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
      class2pupils: pupils.slice(3),
      'puzzles-count-2': this.getRandom(puzzles, 2),
      'puzzles-count-3': this.getRandom(puzzles, 3),
      'puzzles-count-4': this.getRandom(puzzles, 4)
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

    const puzzlesPattern = /\/puzzles\?count=(\w+)/;

    if (RegExp(puzzlesPattern).test(url)) {
      const newUrl = url.replace(puzzlesPattern, '/puzzles-count-$1');
      const parsed = utils.parseRequestUrl(newUrl);
      console.log(newUrl, parsed);
  
      if (parsed) {
        console.log(`parseRequestUrl override of '${url}':`, parsed);
      }
  
      return parsed;
    }
  }

  private getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
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
      },
      {
        id: 'd',
        pgn: `
[Event "The Chess Players' Quarterly Chronicle"]
[Site "?"]
[Date "1870.??.??"]
[Round "-"]
[White "ABBOTT Joseph William"]
[Black "#2"]
[Result "1-0"]
[FEN "K5Q1/3p1R2/3P3p/5N1p/3Pk2P/3p1p2/3B4/7B w - - 0 1"]
[SetUp "1"]

1. Kb7 Kd5 2. Re7# 1-0`.trim()
      }
    ];
  }
}
