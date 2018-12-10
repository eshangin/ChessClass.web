import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pupil} from './pupil.model';
import { PupilActivity } from './pupil-activity.model';

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

  getActivities(pupilId: string): Observable<PupilActivity[]> {
    return this.http.get<PupilActivity[]>(`api/pupils/${pupilId}/activities`);
  }  

  createPupil(classId: string, firstName: string, lastName: string): Observable<Pupil> {
    // TODO :: use default picture
    const body = {
      firstName,
      lastName,
      picture: './assets/kid-pics/boy-1.png',
      classId
    };
    return this.http.post<Pupil>(`api/pupils`, body);
  }
}
