import { Injectable } from '@angular/core';
import {Homework} from './homework.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Puzzle} from './puzzle.model';
import {Router} from '@angular/router';
import { PuzzleFixAttempt } from './puzzle-fix-attempt.model';

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
    // TODO :: remove pupilId parameter. We should get it on server from auth
    const url = homeworkId
      ? `/api/pupils/${pupilId}/homeworks/${homeworkId}/puzzles/${puzzleId}/fixed`
      : `/api/pupils/${pupilId}/homeworks/puzzles/${puzzleId}/fixed`;
    return this.http.post<Puzzle[]>(url, {});
  }

  saveAttempt(homeworkId: string, puzzleId: string, moves: string[]): Observable<any> {
    const url = homeworkId
      ? `/api/homeworks/${homeworkId}/puzzles/${puzzleId}/attempts`
      : `/api/homeworks/puzzles/${puzzleId}/attempts`;
    return this.http.post<any>(url, { moves });
  }

  getAttempts(pupilId: string, homeworkId: string, puzzleId: string): Observable<PuzzleFixAttempt[]> {
    const url = `/api/pupils/${pupilId}/homeworks/${homeworkId}/puzzles/${puzzleId}/attempts`;
    return this.http.get<PuzzleFixAttempt[]>(url);
  }

  getNonFixedPuzzles(homeworkId?: string, count?: number): Observable<Puzzle[]> {
    const url = homeworkId
      ? this.router.parseUrl(`api/homeworks/${homeworkId}/puzzles/non-fixed`)
      : this.router.parseUrl(`api/homeworks/puzzles/non-fixed`)
    if (count) {
      url.queryParams['count'] = count;
    }
    return this.http.get<Puzzle[]>(url.toString());
  }
}
