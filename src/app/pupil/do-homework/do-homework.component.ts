import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {HomeworkService} from 'src/app/services/homework.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Puzzle} from 'src/app/services/puzzle.model';
import { PuzzleSolutionStateType } from 'src/app/shared/chess-puzzle/chess-puzzle.component';
import { Observable } from 'rxjs';
import { User } from 'src/app/services/user.model';
import { ChatMessage } from 'src/app/services/chat-message.model';
import { MoveInfo, MoveType } from 'src/app/shared/chess-board/chess-board.component';

@Component({
  selector: 'app-do-homework',
  templateUrl: './do-homework.component.html',
  styleUrls: ['./do-homework.component.scss']
})
export class DoHomeworkComponent implements OnInit {

  currentPuzzle: Puzzle;
  puzzleState?: PuzzleSolutionStateType;
  puzzleSolutionStateTypes = PuzzleSolutionStateType;
  puzzleFixed: boolean = false;
  currentPupil: User;
  initialMessagesCount: number;
  myLastMove: ChessJS.Move;
  private homeworkId: string;
  private nextPuzzle: Puzzle = null;
  private movements: ChessJS.Move[] = [];

  constructor(
    private authService: AuthService,
    private homeworkService: HomeworkService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentPupil = this.authService.currentUser;
    this.homeworkId = this.route.snapshot.paramMap.get('id');
    this.fetchPuzzle().subscribe(p => {
      this.setNextPuzzle(p);
      this.updateCurrentPuzzle();
    });    
  }

  goToNextPuzzle() {
    this.updateCurrentPuzzle();
  }

  onPuzzleSolutionStateChanged(data: {stateType: PuzzleSolutionStateType, move: ChessJS.Move}) {
    console.log(data);
    this.puzzleState = data.stateType;
    this.myLastMove = data.move;
    if (data.stateType == PuzzleSolutionStateType.PuzzleDone) {
      this.saveAttempt(this.movements).subscribe();
      this.homeworkService.markPuzzleFixed(this.authService.currentUser.id, this.homeworkId, this.currentPuzzle.id).subscribe(() => {
        this.puzzleFixed = true;
        this.fetchPuzzle().subscribe(p => this.setNextPuzzle(p));
      });
    }
  }

  onChatThreadLoaded(chatMessages: ChatMessage[]) {
    this.initialMessagesCount = chatMessages.length;
  }

  onPieceMoved(move: MoveInfo) {
    switch (move.moveType) {
      case MoveType.NormalOnDrop:
      case MoveType.NormalProgrammatic:
        this.movements.push(move.move);
        break;

      case MoveType.Undo:
        this.saveAttempt(this.movements).subscribe();
        this.movements.pop();
        break;
    }
  }

  private saveAttempt(movements: ChessJS.Move[]): Observable<any> {
    return this.homeworkService.saveAttempt(this.homeworkId, this.currentPuzzle.id, movements.map(m => m.san));
  }

  private setNextPuzzle(p: Puzzle) {
    this.nextPuzzle = p;
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
    if (this.nextPuzzle) {
      this.puzzleFixed = false;
      this.movements = [];
      this.puzzleState = null;
      this.currentPuzzle = this.nextPuzzle;
      this.nextPuzzle = null;
    } else {
      this.router.navigate(['/p']);
    }
  }

}
