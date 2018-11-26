import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SchoolClass} from './school-class.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  private classesUrl = 'api/classes';

  constructor(private http: HttpClient) { }

  getClasses(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(this.classesUrl);
  }
}
