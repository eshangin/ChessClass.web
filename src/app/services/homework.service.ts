import { Injectable } from '@angular/core';
import {Homework} from './homework.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Puzzle} from './puzzle.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getHomeworks(pupilId: string): Observable<Homework[]> {
    return this.http.get<Homework[]>(`api/pupils/${pupilId}/homeworks`);
  }

  addHomework(classId: string, puzzleIds: string[]): Observable<void> {
    const body = {
      puzzleIds
    };
    return this.http.post<void>(`api/classes/${classId}/homeworks`, body);
  }

  getClassHomeworks(classId: string): Observable<Homework[]> {
    return this.http.get<Homework[]>(`api/classes/${classId}/homeworks`);
  }

  markPuzzleFixed(pupilId: string, homeworkId: string, puzzleId: string): Observable<any> {
    const url = homeworkId
      ? `/api/pupils/${pupilId}/homeworks/${homeworkId}/puzzles/${puzzleId}/fixed`
      : `/api/pupils/${pupilId}/homeworks/puzzles/${puzzleId}/fixed`;
    return this.http.post<Puzzle[]>(url, {});
  }

  getNonFixedPuzzles(pupilId: string, homeworkId?: string, count: number = 1): Observable<Puzzle[]> {
    const url = homeworkId
      ? this.router.parseUrl(`api/pupils/${pupilId}/homeworks/${homeworkId}/puzzles/non-fixed`)
      : this.router.parseUrl(`api/pupils/${pupilId}/homeworks/puzzles/non-fixed`)
    if (count) {
      url.queryParams['count'] = count;
    }
    return this.http.get<Puzzle[]>(url.toString());
  }
}
