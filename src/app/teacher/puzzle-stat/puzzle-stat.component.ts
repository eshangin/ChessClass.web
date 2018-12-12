import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Puzzle } from 'src/app/services/puzzle.model';
import { Pupil } from 'src/app/services/pupil.model';
import { SchoolClass } from 'src/app/services/school-class.model';
import { Homework } from 'src/app/services/homework.model';

@Component({
  selector: 'app-puzzle-stat',
  templateUrl: './puzzle-stat.component.html',
  styleUrls: ['./puzzle-stat.component.scss']
})
export class PuzzleStatComponent implements OnInit {

  class: SchoolClass;
  homework: Homework;
  puzzle: Puzzle;
  whoFixed: Pupil[] = [];
  whoNotFixed: Pupil[] = [];

  constructor(
    private route: ActivatedRoute,
    private puzzleService: PuzzleService
  ) { }

  ngOnInit() {
    const homeworkId = this.route.snapshot.paramMap.get('homeworkId');
    const puzzleId = this.route.snapshot.paramMap.get('puzzleId');

    this.puzzleService.getPuzzleFixStatistics(homeworkId, puzzleId).subscribe(stat => {
      this.class = stat.class;
      this.homework = stat.homework;
      this.puzzle = stat.puzzle;
      this.whoFixed = stat.statistics.filter(item => item.fixedByPupil).map(item => item.pupil);
      this.whoNotFixed = stat.statistics.filter(item => !item.fixedByPupil).map(item => item.pupil);
    });
  }

}
