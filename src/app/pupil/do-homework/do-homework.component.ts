import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {HomeworkService} from 'src/app/services/homework.service';
import {ActivatedRoute} from '@angular/router';
import {Puzzle} from 'src/app/services/puzzle.model';
import { PuzzleSolutionStateType } from 'src/app/shared/chess-puzzle/chess-puzzle.component';

@Component({
  selector: 'app-do-homework',
  templateUrl: './do-homework.component.html',
  styleUrls: ['./do-homework.component.scss']
})
export class DoHomeworkComponent implements OnInit {

  currentPuzzle: Puzzle;
  puzzleState: PuzzleSolutionStateType;
  puzzleSolutionStateTypes = PuzzleSolutionStateType;
  puzzleFixed: boolean = false;
  private homeworkId: string;

  constructor(
    private authService: AuthService,
    private homeworkService: HomeworkService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.homeworkId = this.route.snapshot.paramMap.get('id');
    this.updateCurrentPuzzle();
  }

  goToNextPuzzle() {
    this.updateCurrentPuzzle();
  }

  onPuzzleSolutionStageChanged(state: PuzzleSolutionStateType) {
    this.puzzleState = state;
    if (state == PuzzleSolutionStateType.PuzzleDone) {
      this.homeworkService.markPuzzleFixed(this.authService.currentUser.id, this.homeworkId, this.currentPuzzle.id).subscribe(() => 
        this.puzzleFixed = true
      );
    }
  }

  private updateCurrentPuzzle() {
    this.homeworkService.getNonFixedPuzzles(this.authService.currentUser.id, this.homeworkId, 1).subscribe(
      puzzles => {
        this.puzzleFixed = false;
        this.currentPuzzle = puzzles[0];
      });
  }

}
