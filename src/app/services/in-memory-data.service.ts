import { InMemoryDbService, RequestInfoUtilities, ParsedRequestUrl } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const quizes = [
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
      }
    ];

    const pupils = [
      { id: 'a', name: 'Иван З', homeworks: [{id: 1, quizes: [ quizes[0], quizes[1] ] }] },
      { id: 'b', name: 'Сергей Б' },
      { id: 'c', name: 'Анна К' },
      { id: 'd', name: 'Игорь П' },
      { id: 'e', name: 'Сергей Н' }
    ];

    const classes = [
      { id: 1, name: 'Class 1' },
      { id: 2, name: 'Class 2' }
    ];

    return {
      classes,
      pupils,
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
}
