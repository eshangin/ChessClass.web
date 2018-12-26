import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Puzzle, PuzzleType } from 'src/app/services/puzzle.model';
import { Pupil } from 'src/app/services/pupil.model';
import { SchoolClass } from 'src/app/services/school-class.model';
import { Homework } from 'src/app/services/homework.model';
import { HomeworkService } from 'src/app/services/homework.service';
import { PuzzleFixAttempt } from 'src/app/services/puzzle-fix-attempt.model';
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import { _ } from 'underscore';
import * as Chess from 'chess.js';

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
  whoFixed: any[] = [];
  whoNotFixed: any[] = [];
  selectedPupil: Pupil;
  puzzleFixAttempts: PuzzleFixAttempt[];
  puzzleCorrectFixAttempts: PuzzleFixAttempt[];
  PuzzleType = PuzzleType;
  puzzleSolution: any;
  puzzleFen: string;

  constructor(
    private route: ActivatedRoute,
    private puzzleService: PuzzleService,
    private homeworkService: HomeworkService,
    private chessHelperService: ChessHelperService
  ) { }

  ngOnInit() {
    this.homeworkId = this.route.snapshot.paramMap.get('homeworkId');
    this.puzzleId = this.route.snapshot.paramMap.get('puzzleId');

    this.loadStatistics();
  }

  viewChat(pupil: Pupil) {
    this.selectedPupil = pupil;
    this.viewMode = 'chat';
    this.homeworkService.getAttempts(pupil.id, this.homeworkId, this.puzzleId).subscribe(attempts => {
      this.puzzleFixAttempts = attempts.sort((a, b) => a.dateCreated > b.dateCreated ? -1:1);
      this.puzzleCorrectFixAttempts = this.puzzleFixAttempts.filter(a => this.isCorrectAttempt(a));
    });
  }

  closeChat() {
    this.selectedPupil = null;
    this.viewMode = 'list';
    this.loadStatistics();
  }

  isCorrectAttempt(attempt: PuzzleFixAttempt): boolean {
    switch (this.puzzle.puzzleType) {
      case PuzzleType.Standard:
        return _(attempt.moves).isEqual(this.puzzleSolution.moves);
      case PuzzleType.FindAllChecks:
        return this.puzzleSolution.allChecks.map(m => m.san).indexOf(attempt.moves[0]) != -1;
    }    
  }

  isCorrectFixAttemptsContanMove(move: string): boolean {
    return this.puzzleCorrectFixAttempts.findIndex(a => a.moves.indexOf(move) != -1) != -1;
  }

  currentPuzzleIsFixedByPupil(pupil: Pupil): boolean {
    return this.whoFixed.findIndex(wf => wf.pupil.id == pupil.id) != -1;
  }

  private loadStatistics() {
    this.puzzleService.getPuzzleFixStatistics(this.homeworkId, this.puzzleId).subscribe(stat => {
      this.class = stat.class;
      this.homework = stat.homework;
      this.puzzle = stat.puzzle as Puzzle;
      switch (this.puzzle.puzzleType) {
        case PuzzleType.Standard:
          let cp = this.chessHelperService.parsePuzzle(this.puzzle.pgn);
          this.puzzleFen = cp.initialFen;
          this.puzzleSolution = {
            moves: cp.solutionMovements.map(m => m.san),
            blackIsFirst: cp.turn == 'b'
          };
          break;
        case PuzzleType.FindAllChecks:
          this.puzzleFen = this.puzzle.fen;
          this.puzzleSolution = {
            allChecks: this.chessHelperService.findAllChecks(this.puzzle.fen),
            turn: new Chess(this.puzzle.fen).turn()
          }
          break;
      }
      this.whoFixed = stat.statistics.filter(item => item.fixedByPupil);
      this.whoNotFixed = stat.statistics.filter(item => !item.fixedByPupil);
    });
  }
}
