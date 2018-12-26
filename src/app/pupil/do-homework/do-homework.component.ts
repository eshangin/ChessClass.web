import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {HomeworkService} from 'src/app/services/homework.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Puzzle, PuzzleType} from 'src/app/services/puzzle.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/services/user.model';
import { ChatMessage } from 'src/app/services/chat-message.model';
import { MoveInfo, MoveType } from 'src/app/shared/chess-board/chess-board.component';
import { IInitializedInfo, IMoveInfo } from 'src/app/shared/puzzle-viewers/find-all-checks-puzzle/find-all-checks-puzzle.component';
import * as Chess from 'chess.js';
import { PuzzleSolutionStateType } from 'src/app/shared/puzzle-viewers/standard-puzzle/standard-puzzle.component';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Api } from 'chessground/api';

@Component({
  selector: 'app-do-homework',
  templateUrl: './do-homework.component.html',
  styleUrls: ['./do-homework.component.scss']
})
export class DoHomeworkComponent implements OnInit, AfterViewChecked {

  currentPuzzle: Puzzle;
  puzzleState?: PuzzleSolutionStateType;
  puzzleSolutionStateTypes = PuzzleSolutionStateType;
  currentPupil: User;
  initialMessagesCount: number = 0;
  myLastMove: ChessJS.Move;
  private homeworkId: string;
  private puzzleId: string;
  private movements: ChessJS.Move[] = [];
  PuzzleType = PuzzleType;
  findAllChecksPuzzleInfo: {
    allChecks: ChessJS.Move[],
    turn: 'w' | 'b',
    foundChecks: string[];
    checksLeft: number;
  };
  @ViewChild('tabs') tabset: NgbTabset;
  private findAllChecksPuzzleCgApi: Api = null;
  private findAllChecksPuzzleNeedRedraw: boolean = false;

  constructor(
    private authService: AuthService,
    private homeworkService: HomeworkService,
    private router: Router,
    private route: ActivatedRoute,
    private puzzleService: PuzzleService
  ) { }

  ngOnInit() {
    this.currentPupil = this.authService.currentUser;
    this.route.params.subscribe(
      params => {
        this.homeworkId = params['homeworkId'];
        this.puzzleId = params['puzzleId'];
        if (!this.puzzleId) {
          this.fetchNextPuzzle().subscribe(p => {
            this.redirectToPuzzle(this.homeworkId, p.id, true);
          });
        } else {
          this.getPuzzle(this.puzzleId).subscribe(p => {
            this.updateCurrentPuzzle(p);
          });    
        }
      }
    );
  }

  ngAfterViewChecked(): void {
    if (this.findAllChecksPuzzleNeedRedraw) {
      this.findAllChecksPuzzleNeedRedraw = false;
      setTimeout(() => {
        this.findAllChecksPuzzleCgApi.redrawAll();
      }, 0);      
    }
  }

  goToNextPuzzle() {
    this.fetchNextPuzzle().subscribe(p => {
      if (p) {
        this.redirectToPuzzle(this.homeworkId, p.id);
      } else {
        this.router.navigate(['/p']);
      }      
    });
  }

  onPuzzleSolutionStateChanged(data: {stateType: PuzzleSolutionStateType, move: ChessJS.Move}) {
    this.tabset.select('tabPuzzleTask');
    this.puzzleState = data.stateType;
    this.myLastMove = data.move;
    if (data.stateType == PuzzleSolutionStateType.PuzzleDone) {
      this.saveAttempt(this.movements).subscribe();
      this.markPuzzleFixed();
    }
  }

  findAllChecksPuzzleOnInitialized(initInfo: IInitializedInfo) {    
    this.findAllChecksPuzzleInfo = {
      allChecks: initInfo.allChecks,
      turn: new Chess(initInfo.fen).turn(),
      foundChecks: [],
      checksLeft: initInfo.allChecks.length
    };
  }

  findAllChecksPuzzleOnMoveMade(moveInfo: IMoveInfo) {
    this.tabset.select('tabPuzzleTask');
    if (this.puzzleState != PuzzleSolutionStateType.PuzzleDone) {
      this.puzzleState = moveInfo.stateType;
      this.myLastMove = moveInfo.move;
      this.saveAttempt([moveInfo.move]).subscribe();
      if (moveInfo.stateType == PuzzleSolutionStateType.CorrectMove || moveInfo.stateType == PuzzleSolutionStateType.PuzzleDone) {
        if (this.findAllChecksPuzzleInfo.foundChecks.indexOf(moveInfo.move.san) == -1) {
          this.findAllChecksPuzzleInfo.foundChecks.push(moveInfo.move.san);
          this.findAllChecksPuzzleInfo.checksLeft--;
          if (moveInfo.stateType == PuzzleSolutionStateType.PuzzleDone) {
            this.markPuzzleFixed();
          }
        }
      }
    }
  }

  findAllChecksPuzzleOnBoardInit(cgApi: Api) {
    this.findAllChecksPuzzleNeedRedraw = true;
    this.findAllChecksPuzzleCgApi = cgApi;
  }

  onChatThreadLoaded(chatMessages: ChatMessage[]) {
    setTimeout(() => {
      this.initialMessagesCount = chatMessages.length;
    }, 0);    
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

  private redirectToPuzzle(homeworkId: string, puzzleId: string, replaceUrl: boolean = false) {
    let matrixParams = {
      puzzleId: puzzleId
    };
    if (homeworkId) {
      matrixParams['homeworkId'] = homeworkId;
    }
    this.router.navigate(['/p/do-homeworks', matrixParams], {replaceUrl: replaceUrl});
  }

  private markPuzzleFixed() {
    this.homeworkService.markPuzzleFixed(this.authService.currentUser.id, this.homeworkId, this.currentPuzzle.id).subscribe(() => {
      //this.fetchNextPuzzle().subscribe(p => this.setNextPuzzle(p));
      // TODO
    });
  }

  private fetchNextPuzzle(): Observable<Puzzle> {
    let call = this.homeworkId
      ? this.homeworkService.getNonFixedPuzzles(this.authService.currentUser.id, this.homeworkId, 1)
      : this.homeworkService.getNonFixedPuzzles(this.authService.currentUser.id, null, 1);

    return new Observable<Puzzle>(observer => {
      return call.subscribe(puzzles => observer.next(puzzles[0]));
    })
  }

  private getPuzzle(puzzleId: string): Observable<Puzzle> {
    return this.puzzleService.getPuzzle(puzzleId);
  }

  private updateCurrentPuzzle(puzzle: Puzzle) {
    this.movements = [];
    this.puzzleState = null;
    this.currentPuzzle = puzzle;
    this.findAllChecksPuzzleInfo = null;
    this.findAllChecksPuzzleCgApi = null;
  }

}
