import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {HomeworkService} from 'src/app/services/homework.service';
import {ActivatedRoute} from '@angular/router';
import {Puzzle} from 'src/app/services/puzzle.model';

@Component({
  selector: 'app-do-homework',
  templateUrl: './do-homework.component.html',
  styleUrls: ['./do-homework.component.scss']
})
export class DoHomeworkComponent implements OnInit {

  currentPuzzle: Puzzle;
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

  // TODO :: remove when interactive puzzle solution will work
  markFixed() {
    this.homeworkService.markPuzzleFixed(this.authService.currentUser.id, this.homeworkId, this.currentPuzzle.id).subscribe(() => this.updateCurrentPuzzle());
  }

  private updateCurrentPuzzle() {
    this.homeworkService.getNonFixedPuzzles(this.authService.currentUser.id, this.homeworkId, 1).subscribe(
      puzzles => {console.log(puzzles); this.currentPuzzle = puzzles[0]});
  }

}
