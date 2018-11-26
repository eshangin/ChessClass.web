import { InMemoryDbService, RequestInfoUtilities, ParsedRequestUrl } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const classes = [
      { id: 1, name: 'Class 1' },
      { id: 2, name: 'Class 2' }
    ];

    const class1pupils = [
      { id: 'a', name: 'Иван З' },
      { id: 'b', name: 'Сергей Б' },
      { id: 'c', name: 'Анна К' }
    ];

    const class2pupils = [
      { id: 'a', name: 'Игорь П' },
      { id: 'b', name: 'Сергей Б' }
    ];

    const pupils = class1pupils.concat(class2pupils);

    return {
      classes,
      pupils,
      class1pupils,
      class2pupils
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
