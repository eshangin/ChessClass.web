import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Puzzle} from './puzzle.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getPuzzles(count?: number): Observable<Puzzle[]> {
    var url = this.router.parseUrl('api/puzzles');
    if (count) {
      url.queryParams['count'] = count;
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
