import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pupil} from './pupil.model';

@Injectable({
  providedIn: 'root'
})
export class PupilService {

  constructor(private http: HttpClient) { }

  getPupils(classId: string): Observable<Pupil[]> {
    return this.http.get<Pupil[]>(`api/classes/${classId}/pupils`);
  }

  getPupil(pupilId: string): Observable<Pupil> {
    return this.http.get<Pupil>(`api/pupils/${pupilId}`);
  }
}
