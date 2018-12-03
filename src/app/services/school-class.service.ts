import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SchoolClass} from './school-class.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  constructor(private http: HttpClient) { }

  getClasses(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>('api/classes');
  }

  createClass(name: string): Observable<SchoolClass> {
    const body = {
      name
    };
    return this.http.post<SchoolClass>(`api/classes`, body);
  }

  getClass(classId: string): any {
    return this.http.get<SchoolClass>(`api/classes/${classId}`);
  }

}
