import { Injectable } from '@angular/core';
import {Homework} from './homework.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  constructor(private http: HttpClient) { }

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
}
