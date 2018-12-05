import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {Puzzle} from '../services/puzzle.model';
import {Router} from '@angular/router';
import {Pupil} from '../services/pupil.model';
import {SchoolClass} from '../services/school-class.model';
import {Homework} from '../services/homework.model';
import {User, Role} from '../services/user.model';
import {HomeworkPupilStat} from '../services/homework-pupil-stat.model';

class Db {
    puzzles: Puzzle[];
    classes: SchoolClass[];
    pupils: Pupil[];
    pupil2class: Pupil2Class[];
    homeworks: DbHomework[];
    homework2puzzle: DbHomework2Puzzle[];
    fixedPuzzles: DbFixedPuzzle[];
}

class Pupil2Class {
    id: string;
    pupilId: string;
    classId: string;
}

class DbFixedPuzzle {
    id: string;
    homework2puzzleId: string;
    pupilId: string;
    dateCreated: Date;
}

class DbHomework2Puzzle {
    id: string;
    homeworkId: string;
    puzzleId: string;
    dateCreated: Date;
}

class DbHomework {
    id: string;
    classId: string;
    dateCreated: Date
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    //
    // used https://github.com/cornflourblue/angular2-registration-login-example/blob/master/app/_helpers/fake-backend.ts as example
    //

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const db = this.getDb();

        let result = null;

        if (request.url.match(/api\/puzzles/) && request.method === 'GET') {
            const url = this.router.parseUrl(request.url);
            const count = url.queryParamMap.get('count');
            result = of(new HttpResponse({ status: 200, body: count ? this.getRandom(db.puzzles, count) : db.puzzles }));
        } else if (request.url.match(/api\/auth\/login/)) {
            if (request.url == 'api/auth/login/pupil') {
                const randomPupil = db.pupils[Math.floor(Math.random() * db.pupils.length)];
                result = of(new HttpResponse({ status: 200, body: <User>{ id: randomPupil.id, name: randomPupil.name, role: Role.Pupil } }));
            } else if (request.url == 'api/auth/login/teacher') {
                result = of(new HttpResponse({ status: 200, body: <User>{ id: this.generateId(), name: 'Бобби Фишер', role: Role.Pupil } }));
            }
        } else if (request.url.match(/api\/favorites(\/(\w+))?/)) {
            const id = request.url.split('/')[2];
            if (request.method == "POST") {
                db.puzzles.find(_ => _.id == id).isFavorite = true;
                this.updateStoragePuzzles(db.puzzles);
                result = of(new HttpResponse({ status: 200 }));
            } else if (request.method == "DELETE") {
                db.puzzles.find(_ => _.id == id).isFavorite = false;
                this.updateStoragePuzzles(db.puzzles);
                result = of(new HttpResponse({ status: 200 }));
            } else if (request.method == "GET") {
                console.log(id);
                if (!id) {
                    result = of(new HttpResponse({ status: 200, body: db.puzzles.filter(_ => _.isFavorite == true) }));
                }
            }
        } else if (request.url == "api/classes") {
            if (request.method == "GET") {
                const classes = db.classes.map(c => {
                    db.pupil2class.filter(p2c => p2c.classId == c.id).forEach(p2c => {
                        c.pupils.push(db.pupils.find(p => p.id == p2c.pupilId));
                    });
                    return c;
                });
                result = of(new HttpResponse({ status: 200, body: classes }));
            } else if (request.method == "POST") {
                result = of(new HttpResponse({ status: 200, body: this.createClass(request.body.name) }));
            }
        } else if (request.url.match(/api\/classes\/(\w+)$/)) {
            const id = request.url.split('/')[2];
            if (request.method == "GET") {
                const c = db.classes.find(_ => _.id == id);                
                db.pupil2class.filter(p2c => p2c.classId == c.id).forEach(p2c => {
                    c.pupils.push(db.pupils.find(p => p.id == p2c.pupilId));
                });
                result = of(new HttpResponse({ status: 200, body: c }));
            }
        } else if (request.url.match(/api\/classes\/(\w+)\/pupils$/)) {
            const id = request.url.split('/')[2];
            if (request.method == "GET") {
                const pupilIds = db.pupil2class.filter(_ => _.classId == id).map(_ => _.pupilId);
                const pupils = db.pupils.filter(_ => pupilIds.includes(_.id));
                result = of(new HttpResponse({ status: 200, body: pupils }));
            }
        } else if (request.url.match(/api\/pupils\/(\w+)$/)) {
            const id = request.url.split('/')[2];
            if (request.method == "GET") {
                const pupil = db.pupils.find(_ => _.id == id);
                result = of(new HttpResponse({ status: 200, body: pupil }));
            }
        } else if (request.url.match(/api\/pupils$/)) {
            if (request.method == "POST") {
                const pupil = this.createPupil(request.body.firstName, request.body.lastName, request.body.picture);                
                this.addPupillToClass(pupil, db.classes.find(_ => _.id == request.body.classId));
                result = of(new HttpResponse({ status: 200, body: pupil }));
            }
        } else if (request.url.match(/api\/classes\/(\w+)\/homeworks$/)) {
            const id = request.url.split('/')[2];
            if (request.method == "POST") {
                this.addHomework(id, request.body.puzzleIds);
                result = of(new HttpResponse({ status: 200 }));
            } else if (request.method == "GET") {
                const homeworks = db.homeworks.filter(_ => _.classId == id);
                const items = homeworks.map(_ => {
                    let h = new Homework();
                    h.id = _.id;
                    h.classId = _.classId;
                    h.puzzles = db.homework2puzzle.filter(h2p => h2p.homeworkId == _.id).map(h2p => db.puzzles.find(p => p.id == h2p.puzzleId));
                    h.dateCreated = _.dateCreated;
                    return h;
                }).sort((a, b) => a.dateCreated > b.dateCreated ? -1:1);
                result = of(new HttpResponse({ status: 200, body: items }));
            }
        } else if (request.url.match(/api\/pupils\/(\w+)\/homeworks$/)) {
            const pupilId = request.url.split('/')[2];
            if (request.method == "GET") {
                const classId = db.pupil2class.find(_ => _.pupilId == pupilId).classId;
                const homeworks = db.homeworks.filter(_ => _.classId == classId);
                const items = homeworks.map(_ => {
                    let h = new Homework();
                    h.id = _.id;
                    h.classId = _.classId;
                    h.puzzles = db.homework2puzzle.filter(h2p => h2p.homeworkId == _.id).map(h2p => db.puzzles.find(p => p.id == h2p.puzzleId));
                    h.dateCreated = _.dateCreated;
                    let h2pItems = db.homework2puzzle.filter(h2p => h2p.homeworkId == _.id);
                    h.pupilStats = [{
                        pupilId: pupilId,
                        fixedPuzzlesCount: db.fixedPuzzles.filter(_ => _.pupilId == pupilId && h2pItems.map(h2p => h2p.id).indexOf(_.homework2puzzleId) != -1).length
                    } as HomeworkPupilStat]
                    return h;
                }).sort((a, b) => a.dateCreated > b.dateCreated ? -1:1);
                result = of(new HttpResponse({ status: 200, body: items }));
            }
        } else if (request.url.match(/api\/pupils\/(\w+)\/homeworks\/(\w+)\/puzzles\/non-fixed/)) {
            const pupilId = request.url.split('/')[3];
            const homeworkId = request.url.split('/')[5];
            const url = this.router.parseUrl(request.url);
            const count = +url.queryParamMap.get('count');
            if (request.method == "GET") {
                const puzzles = db.homework2puzzle
                    .filter(h2p => h2p.homeworkId == homeworkId && !db.fixedPuzzles.find(fp => fp.pupilId == pupilId && fp.homework2puzzleId == h2p.id))
                    .sort((a, b) => a.dateCreated > b.dateCreated ? -1:1)
                    .map(h2p => db.puzzles.find(p => p.id == h2p.puzzleId));

                result = of(new HttpResponse({ status: 200, body: count ? puzzles.slice(0, count) : puzzles }));
            }
        } else if (request.url.match(/api\/pupils\/(\w+)\/homeworks\/(\w+)\/puzzles\/(\w+)\/fixed/)) {
            const pupilId = request.url.split('/')[3];
            const homeworkId = request.url.split('/')[5];
            const puzzleId = request.url.split('/')[7];
            if (request.method == "POST") {
                this.markPuzzleFixed(pupilId, homeworkId, puzzleId);
                result = of(new HttpResponse({ status: 200 }));
            }
        }

        if (result) {
            console.log('intercepted', request.url);
            return result;
        }

        // pass through any requests not handled above
        return next.handle(request);
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
            this.createPupil('Иван', 'З', './assets/kid-pics/boy-1.png');
            this.createPupil('Сергей', 'Б', './assets/kid-pics/boy-2.png');
            this.createPupil('Анна', 'К', './assets/kid-pics/girl-1.png');
            this.createPupil('Игорь', 'П', './assets/kid-pics/boy-3.png');
            this.createPupil('Лена', 'Н', './assets/kid-pics/girl-2.png');
            const pupils = this.getPupils();

            this.createClass('Класс 1');
            this.createClass('Класс 2');
            const classes = this.getClasses();
            localStorage.setItem('pupils', JSON.stringify(pupils));
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
            pupil2class: JSON.parse(localStorage.getItem('pupil2class')),
            homeworks: JSON.parse(localStorage.getItem('homeworks')) || [],
            homework2puzzle: JSON.parse(localStorage.getItem('homework2puzzle')) || [],
            fixedPuzzles: JSON.parse(localStorage.getItem('fixedPuzzles')) || [],
        } as Db;
    }

    private markPuzzleFixed(pupilId: string, homeworkId: string, puzzleId: string) {
        let fixedPuzzles = this.getDb().fixedPuzzles;
        let h2p = this.getDb().homework2puzzle.find(_ => _.homeworkId == homeworkId && _.puzzleId == puzzleId);
        fixedPuzzles.push({ id: this.generateId(), pupilId: pupilId, homework2puzzleId: h2p.id, dateCreated: new Date() } as DbFixedPuzzle);
        localStorage.setItem('fixedPuzzles', JSON.stringify(fixedPuzzles));
    }

    private addHomework(classId: string, puzzleIds: string[]) {
        const date = new Date();
        let homeworks = this.getDb().homeworks;
        let homework2puzzle = this.getDb().homework2puzzle;
        var newHomework = { id: this.generateId(), classId, dateCreated: date } as DbHomework;
        homeworks.push(newHomework);
        puzzleIds.forEach(id => homework2puzzle.push({ id: this.generateId(), homeworkId: newHomework.id, puzzleId: id, dateCreated: date } as DbHomework2Puzzle));
        localStorage.setItem('homeworks', JSON.stringify(homeworks));
        localStorage.setItem('homework2puzzle', JSON.stringify(homework2puzzle));
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

    private createPupil(firstName: string, lastName: string, picture: string) {
        const p = <Pupil>{ id: this.generateId(), name: firstName + ' ' + lastName, picture: picture };
        const pupils = this.getPupils();
        pupils.push(p);
        localStorage.setItem('pupils', JSON.stringify(pupils));
        return p;
    }

    private getPupils(): Pupil[] {
        return JSON.parse(localStorage.getItem('pupils')) || [];
    }

    private createClass(name: string): SchoolClass {
        const c = <SchoolClass>{ id: this.generateId(), name: name, pupils: [] };
        const classes = this.getClasses();
        classes.push(c);
        localStorage.setItem('classes', JSON.stringify(classes));
        return c;
    }

    private getClasses(): SchoolClass[] {
        return JSON.parse(localStorage.getItem('classes')) || [];
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
