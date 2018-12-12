import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HomeworkService} from 'src/app/services/homework.service';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {SchoolClass} from 'src/app/services/school-class.model';
import {Homework} from 'src/app/services/homework.model';
import { forkJoin } from 'rxjs';

class HomeworkViewModel {
  id: string;
  dateCreated: Date;
  puzzles: PuzzleViewModel[];
}

class PuzzleViewModel {
  id: string;
  pgn: string;
  fixedPercent: number;
}

@Component({
  selector: 'app-school-class',
  templateUrl: './school-class.component.html',
  styleUrls: ['./school-class.component.scss']
})
export class SchoolClassComponent implements OnInit {

  class: SchoolClass;
  homeworks: HomeworkViewModel[];

  constructor(
    private route: ActivatedRoute,
    private homeworkService: HomeworkService,
    private classService: SchoolClassService) { }

  ngOnInit() {
    const classId = this.route.snapshot.paramMap.get('id');
    forkJoin([
      this.classService.getClass(classId),
      this.homeworkService.getClassHomeworks(classId)
    ]).subscribe(results => {
      this.class = results[0];
      const pupilsCount = this.class.pupils.length;
      this.homeworks = (results[1] as Homework[]).map(h => {
        return {
          id: h.id,
          dateCreated: h.dateCreated,
          puzzles: h.puzzles.map(p => {
            return {
              id: p.id,
              pgn: p.pgn,
              fixedPercent: Math.ceil(h.pupilStats.filter(ps => ps.fixedPuzzleIds.indexOf(p.id) != -1).length / pupilsCount * 100)
            } as PuzzleViewModel
          })
        } as HomeworkViewModel;
      });
    });
  }

}
