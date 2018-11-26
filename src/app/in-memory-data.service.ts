import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const classes = [
      { id: 1, name: 'Class 1' },
      { id: 2, name: 'Class 2' },
      { id: 3, name: 'Class 3' }
    ];

    return {
      classes
    };
  }

  constructor() { }
}
