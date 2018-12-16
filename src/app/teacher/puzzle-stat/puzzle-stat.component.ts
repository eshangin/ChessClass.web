import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Puzzle } from 'src/app/services/puzzle.model';
import { Pupil } from 'src/app/services/pupil.model';
import { SchoolClass } from 'src/app/services/school-class.model';
import { Homework } from 'src/app/services/homework.model';
import { HomeworkService } from 'src/app/services/homework.service';
import { PuzzleFixAttempt } from 'src/app/services/puzzle-fix-attempt.model';
import { ChessPuzzle } from 'src/app/services/chess-helper.service';
import { _ } from 'underscore';

@Component({
  selector: 'app-puzzle-stat',
  templateUrl: './puzzle-stat.component.html',
  styleUrls: ['./puzzle-stat.component.scss']
})
export class PuzzleStatComponent implements OnInit {

  homeworkId: string;
  puzzleId: string;
  viewMode: string = 'list';
  class: SchoolClass;
  homework: Homework;
  puzzle: Puzzle;
  puzzleInfo: ChessPuzzle;
  whoFixed: any[] = [];
  whoNotFixed: any[] = [];
  selectedPupil: Pupil;
  puzzleFixAttempts: PuzzleFixAttempt[];

  constructor(
    private route: ActivatedRoute,
    private puzzleService: PuzzleService,
    private homeworkService: HomeworkService
  ) { }

  ngOnInit() {
    this.homeworkId = this.route.snapshot.paramMap.get('homeworkId');
    this.puzzleId = this.route.snapshot.paramMap.get('puzzleId');

    this.loadStatistics();
  }

  viewChat(pupil: Pupil) {
    this.selectedPupil = pupil;
    this.viewMode = 'chat';
    console.log(pupil)
    this.homeworkService.getAttempts(pupil.id, this.homeworkId, this.puzzleId).subscribe(attempts => {
      this.puzzleFixAttempts = attempts.sort((a, b) => a.dateCreated > b.dateCreated ? -1:1);
    });
  }

  closeChat() {
    this.selectedPupil = null;
    this.viewMode = 'list';
    this.loadStatistics();
  }

  onPuzzlePgnUpdated(puzzleInfo: ChessPuzzle) {
    this.puzzleInfo = puzzleInfo;
    console.log(puzzleInfo);
  }

  isCorrectAttempt(attempt: PuzzleFixAttempt): boolean {
    return _(attempt.moves).isEqual(this.puzzleInfo.solutionMovements);
  }

  private loadStatistics() {
    this.puzzleService.getPuzzleFixStatistics(this.homeworkId, this.puzzleId).subscribe(stat => {
      this.class = stat.class;
      this.homework = stat.homework;
      this.puzzle = stat.puzzle;
      this.whoFixed = stat.statistics.filter(item => item.fixedByPupil);
      this.whoNotFixed = stat.statistics.filter(item => !item.fixedByPupil);

      // TODO :: remove when attempts view be complete
      //this.viewChat(stat.statistics[0].pupil);
    });
  }
}
