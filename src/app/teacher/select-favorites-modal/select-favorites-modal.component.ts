import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PuzzleService} from 'src/app/services/puzzle.service';
import {Puzzle} from 'src/app/services/puzzle.model';

class SelectablePuzzle {
  puzzle: Puzzle;
  isSelected: false;
  constructor(p: Puzzle) { this.puzzle = p; }
}

@Component({
  selector: 'app-select-favorites-modal',
  templateUrl: './select-favorites-modal.component.html',
  styleUrls: ['./select-favorites-modal.component.scss']
})
export class SelectFavoritesModalComponent implements OnInit {

  isLoading: boolean = true;
  selectablePuzzles: SelectablePuzzle[];

  constructor(
    public activeModal: NgbActiveModal,
    private puzzleService: PuzzleService) { }

  ngOnInit() {
    this.puzzleService.getFavorites().subscribe(puzzles => {
      this.selectablePuzzles = puzzles.map(_ => new SelectablePuzzle(_));
      this.isLoading = false;
    });
  }

  get getSelectedPuzzles(): Puzzle[] {
    return this.selectablePuzzles.filter(_ => _.isSelected).map(_ => _.puzzle);
  }

}
