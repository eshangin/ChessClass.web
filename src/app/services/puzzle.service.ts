import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Puzzle} from './puzzle.model';
import {Router} from '@angular/router';

export interface IPuzzlesFilter {
  count?: number;
  forClassId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getPuzzles(filter?: IPuzzlesFilter): Observable<Puzzle[]> {
    filter = filter || {};
    var url = this.router.parseUrl('api/puzzles');
    if (filter.count) {
      url.queryParams['count'] = filter.count;
    }
    if (filter.forClassId) {
      url.queryParams['forClassId'] = filter.forClassId;
    }
    return this.http.get<Puzzle[]>(url.toString());
  }

  getPuzzleFixStatistics(homeworkId: string, puzzleId: string): Observable<any> {
    var url = this.router.parseUrl(`/api/homeworks/${homeworkId}/puzzles/${puzzleId}/statistics`);
    return this.http.get<any>(url.toString());
  }

  getFavorites(): Observable<Puzzle[]> {
    return this.http.get<Puzzle[]>('api/favorites');
  }
  
  addToFavorites(puzzleId: string): Observable<any> {
    return this.http.post(`api/favorites/${puzzleId}`, null);
  }

  createPuzzle(pgn: string, description?: string): Observable<Puzzle> {
    return this.http.post<Puzzle>(`/api/puzzles`, {
      pgn: pgn,
      description: description
    });
  }

  removeFromFavorites(puzzleId: string): Observable<any> {
    return this.http.delete(`api/favorites/${puzzleId}`);
  }
}
