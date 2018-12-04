import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { tap, delay } from 'rxjs/operators';

export enum Role {
  Teacher = 1,
  Pupil
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  role: Role;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => {
        this.isLoggedIn = true;
        this.role = Role.Teacher;
      })
    );
  }

  pupilLogin(code: string): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => {
        this.isLoggedIn = true;
        this.role = Role.Pupil;
      })
    );
  }  

  logout(): Observable<any> {
    this.isLoggedIn = false;
    return of(true);
  }
}
