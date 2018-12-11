import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {HomeworkService} from 'src/app/services/homework.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Puzzle} from 'src/app/services/puzzle.model';
import { PuzzleSolutionStateType } from 'src/app/shared/chess-puzzle/chess-puzzle.component';
import { Observable } from 'rxjs';

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
  private nextPuzzle: Puzzle = null;

  constructor(
    private authService: AuthService,
    private homeworkService: HomeworkService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.homeworkId = this.route.snapshot.paramMap.get('id');
    this.fetchPuzzle().subscribe(p => {
      this.setNextPuzzle(p);
      this.updateCurrentPuzzle();
    });    
  }

  goToNextPuzzle() {
    this.updateCurrentPuzzle();
  }

  onPuzzleSolutionStageChanged(state: PuzzleSolutionStateType) {
    this.puzzleState = state;
    if (state == PuzzleSolutionStateType.PuzzleDone) {
      this.homeworkService.markPuzzleFixed(this.authService.currentUser.id, this.homeworkId, this.currentPuzzle.id).subscribe(() => {
        this.puzzleFixed = true;
        this.fetchPuzzle().subscribe(p => this.setNextPuzzle(p));
      });
    }
  }

  private setNextPuzzle(p: Puzzle) {
    if (!p) {
      this.router.navigate(['/p']);
    } else {
      this.nextPuzzle = p;
    }
  }

  private fetchPuzzle(): Observable<Puzzle> {
    let call = this.homeworkId
      ? this.homeworkService.getNonFixedPuzzles(this.authService.currentUser.id, this.homeworkId, 1)
      : this.homeworkService.getNonFixedPuzzles(this.authService.currentUser.id, null, 1);

    return new Observable<Puzzle>(observer => {
      return call.subscribe(puzzles => observer.next(puzzles[0]));
    })
  }

  private updateCurrentPuzzle() {
    this.puzzleFixed = false;
    this.currentPuzzle = this.nextPuzzle;
    this.nextPuzzle = null;
  }

}
