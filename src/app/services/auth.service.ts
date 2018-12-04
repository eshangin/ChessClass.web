import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Role, User} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  role: Role;
  currentUser: User = null;
  get isLoggedIn() { return this.currentUser != null; }

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: HttpClient) {}

  login(): Observable<User> {
    let body = { };

    return this.http.post<User>(`api/auth/login/teacher`, body).pipe(
      delay(1000),
      tap(val => {
        this.loginAs(val);
      })
    );
  }

  pupilLogin(code: string): Observable<User> {
    let body = { 
      code 
    };
    return this.http.post<User>(`api/auth/login/pupil`, body).pipe(
      delay(1000),
      tap(val => {
        this.loginAs(val);
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    return of(true);
  }

  restoreSession() {
    const u = localStorage.getItem('currentUser');
    if (u) {
      this.loginAs(<User>JSON.parse(u));
    }
  }

  private loginAs(user: User) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
