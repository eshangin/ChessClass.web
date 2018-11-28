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
}
