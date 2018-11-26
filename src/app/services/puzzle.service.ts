import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Puzzle} from './puzzle.model';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  constructor(private http: HttpClient) { }

  getPuzzles(): Observable<Puzzle[]> {
    return this.http.get<Puzzle[]>(`api/puzzles`);
  }  
}
