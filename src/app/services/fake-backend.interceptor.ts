import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {Puzzle} from './puzzle.model';
import {Router} from '@angular/router';
import {Pupil} from './pupil.model';

class Db {
    puzzles: Puzzle[];
    classes: any[];
    pupils: Pupil[];
    pupil2class: Pupil2Class[]
}

class Pupil2Class {
    id: string;
    pupilId: string;
    classId: string;
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    //
    // used https://github.com/cornflourblue/angular2-registration-login-example/blob/master/app/_helpers/fake-backend.ts as example
    //

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const db = this.getDb();

        // const pupils = [
        //     { id: 'a', name: 'Иван З', homeworks: [{id: 1, puzzles: [ puzzles[0], puzzles[1] ] }] },
        //     { id: 'b', name: 'Сергей Б' },
        //     { id: 'c', name: 'Анна К' },
        //     { id: 'd', name: 'Игорь П' },
        //     { id: 'e', name: 'Сергей Н' }
        // ];

        let result = null;

        if (request.url.match(/api\/puzzles/) && request.method === 'GET') {
            const url = this.router.parseUrl(request.url);
            const count = url.queryParamMap.get('count');
            result = of(new HttpResponse({ status: 200, body: count ? this.getRandom(db.puzzles, count) : db.puzzles }));
        } else if (request.url.match(/api\/puzzles\/(\w+)\/favorites/)) {
            const id = request.url.split('/')[2];
            if (request.method == "POST") {
                db.puzzles.find(_ => _.id == id).isFavorite = true;
                this.updateStoragePuzzles(db.puzzles);
                result = of(new HttpResponse({ status: 200 }));
            } else if (request.method == "DELETE") {
                db.puzzles.find(_ => _.id == id).isFavorite = false;
                this.updateStoragePuzzles(db.puzzles);
                result = of(new HttpResponse({ status: 200 }));
            }
        } else if (request.url == "api/classes") {
            result = of(new HttpResponse({ status: 200, body: db.classes }));
        } else if (request.url.match(/api\/classes\/(\w+)\/pupils/)) {
            const id = request.url.split('/')[2];
            if (request.method == "GET") {
                const pupilIds = db.pupil2class.filter(_ => _.classId == id).map(_ => _.pupilId);
                const pupils = db.pupils.filter(_ => pupilIds.includes(_.id));
                result = of(new HttpResponse({ status: 200, body: pupils }));
            }
        } else if (request.url.match(/api\/pupils\/(\w+)/)) {
            const id = request.url.split('/')[2];
            if (request.method == "GET") {
                const pupil = db.pupils.find(_ => _.id == id);
                result = of(new HttpResponse({ status: 200, body: pupil }));
            }
        }

        if (result) {
            console.log('intercepted', request.url);
            return result;
        }

        // pass through any requests not handled above
        return next.handle(request);

        /*
        // authenticate
        if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
            // find if any user matches login credentials
            let filteredUsers = users.filter(user => {
                return user.username === request.body.username && user.password === request.body.password;
            });

            if (filteredUsers.length) {
                // if login details are valid return 200 OK with user details and fake jwt token
                let user = filteredUsers[0];
                let body = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                };

                return of(new HttpResponse({ status: 200, body: body }));
            } else {
                // else return 400 bad request
                return Observable.throw('Username or password is incorrect');
            }
        }

        // get users
        if (request.url.endsWith('/api/users') && request.method === 'GET') {
            // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                return of(new HttpResponse({ status: 200, body: users }));
            } else {
                // return 401 not authorised if token is null or invalid
                return Observable.throw('Unauthorised');
            }
        }

        // get user by id
        if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
            // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                // find user by id in users array
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                let matchedUsers = users.filter(user => { return user.id === id; });
                let user = matchedUsers.length ? matchedUsers[0] : null;

                return of(new HttpResponse({ status: 200, body: user }));
            } else {
                // return 401 not authorised if token is null or invalid
                return Observable.throw('Unauthorised');
            }
        }

        // create user
        if (request.url.endsWith('/api/users') && request.method === 'POST') {
            // get new user object from post body
            let newUser = request.body;

            // validation
            let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
            if (duplicateUser) {
                return Observable.throw('Username "' + newUser.username + '" is already taken');
            }

            // save new user
            newUser.id = users.length + 1;
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // respond 200 OK
            return of(new HttpResponse({ status: 200 }));
        }

        // delete user
        if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
            // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                // find user by id in users array
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                for (let i = 0; i < users.length; i++) {
                    let user = users[i];
                    if (user.id === id) {
                        // delete user
                        users.splice(i, 1);
                        localStorage.setItem('users', JSON.stringify(users));
                        break;
                    }
                }

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            } else {
                // return 401 not authorised if token is null or invalid
                return Observable.throw('Unauthorised');
            }
        }

        // pass through any requests not handled above
        return next.handle(request);
        */

        /*
        // wrap in delayed observable to simulate server api call
        return mergeMap(() => {
        });
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .materialize()
        .delay(500)
        .dematerialize();
        */
    }

    private updateStoragePuzzles(puzzles: Puzzle[]) {
        localStorage.setItem('puzzles', JSON.stringify(puzzles));
    }

    private getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    private getDb(): Db {
        if (!localStorage.getItem('isInitialized')) {
            const pupils = this.getPupils();
            const classes = this.getClasses();
            localStorage.setItem('pupils', JSON.stringify(pupils));
            localStorage.setItem('classes', JSON.stringify(classes));
            this.updateStoragePuzzles(this.getPuzzles());
            this.addPupillToClass(pupils[0], classes[0]);
            this.addPupillToClass(pupils[1], classes[0]);
            this.addPupillToClass(pupils[2], classes[1]);
            this.addPupillToClass(pupils[3], classes[1]);
            this.addPupillToClass(pupils[4], classes[1]);

            localStorage.setItem('isInitialized', 'true');
        }

        return {
            puzzles: JSON.parse(localStorage.getItem('puzzles')),
            classes: JSON.parse(localStorage.getItem('classes')),
            pupils: JSON.parse(localStorage.getItem('pupils')),
            pupil2class: JSON.parse(localStorage.getItem('pupil2class'))
        } as Db;
    }

    private addPupillToClass(pupil: any, classItem: any) {
        let pupil2class = JSON.parse(localStorage.getItem('pupil2class')) || [];
        pupil2class.push({ id: this.generateId(), pupilId: pupil.id, classId: classItem.id } as Pupil2Class)
        localStorage.setItem('pupil2class', JSON.stringify(pupil2class));
    }

    private generateId(): string {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return Math.random().toString(36).substr(2, 9);
    };

    private getPupils(): any[] {
        return [
            { id: 'a', name: 'Иван З' },
            { id: 'b', name: 'Сергей Б' },
            { id: 'c', name: 'Анна К' },
            { id: 'd', name: 'Игорь П' },
            { id: 'e', name: 'Сергей Н' }
        ];
    }

    private getClasses(): any[] {
        return [
            { id: '1', name: 'Класс 1' },
            { id: '2', name: 'Класс 2' }
        ];
    }

    private getPuzzles(): Puzzle[] {
        return [
          {
            id: 'a',
            pgn: `
[Round "-"]
[White "9 AUTHORS"]
[Black "#2"]
[Result "1-0"]
[FEN "8/8/8/8/1Q6/1K6/8/2Nk4 w - - 0 1"]
[SetUp "1"]

1. Qa5 Kxc1 2. Qe1# 1-0`.trim() 
          } as Puzzle,
          {
            id: 'b',
            pgn: `
[Event "Illustrated London News"]
[Site "?"]
[Date "1849.??.??"]
[Round "-"]
[White "A. B. S."]
[Black "#2"]
[Result "1-0"]
[FEN "8/8/5R2/8/2P1k3/2K5/5P2/2B5 w - - 0 1"]
[SetUp "1"]

1. Bb2 Ke5 2. Kd3# 1-0`.trim()
          } as Puzzle,
          {
            id: 'c',
            pgn: `
[Event "Probleemblad"]
[Site "?"]
[Date "1983.??.??"]
[Round "-"]
[White "AARZEN Hans"]
[Black "#2"]
[Result "1-0"]
[FEN "2R3N1/3prn2/NP2qp2/3k1B2/R4PPQ/BnP2P2/bK2p3/8 w - - 0 1"]
[SetUp "1"]

1. Qxf6 Bb1 2. c4# 1-0`.trim()
          } as Puzzle,
          {
            id: 'd',
            pgn: `
[Event "The Chess Players' Quarterly Chronicle"]
[Site "?"]
[Date "1870.??.??"]
[Round "-"]
[White "ABBOTT Joseph William"]
[Black "#2"]
[Result "1-0"]
[FEN "K5Q1/3p1R2/3P3p/5N1p/3Pk2P/3p1p2/3B4/7B w - - 0 1"]
[SetUp "1"]

1. Kb7 Kd5 2. Re7# 1-0`.trim()
          } as Puzzle
        ];
      }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};