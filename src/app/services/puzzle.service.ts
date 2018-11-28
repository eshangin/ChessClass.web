import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Puzzle} from './puzzle.model';
import {Router} from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getPuzzles(count?: number): Observable<Puzzle[]> {
    var url = this.router.parseUrl('/api/puzzles');
    if (count) {
      url.queryParams['count'] = count;
    }
    return this.http.get<Puzzle[]>(url.toString());
  }
  
  addToFavorites(puzzleId: string): Observable<any> {
    return this.http.put(`/api/puzzles/${puzzleId}/favorites`, null, httpOptions);
  }

  removeFromFavorites(puzzleId: string): Observable<any> {
    return this.http.delete(`/api/puzzles/${puzzleId}/favorites`, httpOptions);
  }
}
