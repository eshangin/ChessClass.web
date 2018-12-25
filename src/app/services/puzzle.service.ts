import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Puzzle} from './puzzle.model';
import {Router} from '@angular/router';
import { IPagingRequest, PagingHelper, IPaging } from './paging';

export interface IPuzzlesFilter extends IPagingRequest {
  forClassId?: string;
  sort?: 'random' | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private pagingHelper: PagingHelper) { }

  getPuzzles(filter?: IPuzzlesFilter): Observable<IPaging<Puzzle>> {
    filter = filter || {};
    var url = this.router.parseUrl('api/puzzles');
    this.pagingHelper.setPagingParams(url.queryParams, filter);
    if (filter.forClassId) {
      url.queryParams['forClassId'] = filter.forClassId;
    }
    if (filter.sort) {
      url.queryParams['sort'] = filter.sort;
    }
    return this.http.get<IPaging<Puzzle>>(url.toString());
  }

  getPuzzle(puzzleId: string): Observable<Puzzle> {
    return this.http.get<Puzzle>(`/api/puzzles/${puzzleId}`);
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
